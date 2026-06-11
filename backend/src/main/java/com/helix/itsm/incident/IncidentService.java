package com.helix.itsm.incident;

import com.helix.itsm.category.Category;
import com.helix.itsm.category.CategoryRepository;
import com.helix.itsm.common.BadRequestException;
import com.helix.itsm.common.NotFoundException;
import com.helix.itsm.incident.dto.*;
import com.helix.itsm.user.AppUser;
import com.helix.itsm.user.SupportGroup;
import com.helix.itsm.user.SupportGroupRepository;
import com.helix.itsm.user.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Objects;

@Service
public class IncidentService {

    private final IncidentRepository incidentRepository;
    private final IncidentCommentRepository commentRepository;
    private final IncidentActivityRepository activityRepository;
    private final UserRepository userRepository;
    private final SupportGroupRepository groupRepository;
    private final CategoryRepository categoryRepository;
    private final IncidentNumberGenerator numberGenerator;

    public IncidentService(IncidentRepository incidentRepository,
                           IncidentCommentRepository commentRepository,
                           IncidentActivityRepository activityRepository,
                           UserRepository userRepository,
                           SupportGroupRepository groupRepository,
                           CategoryRepository categoryRepository,
                           IncidentNumberGenerator numberGenerator) {
        this.incidentRepository = incidentRepository;
        this.commentRepository = commentRepository;
        this.activityRepository = activityRepository;
        this.userRepository = userRepository;
        this.groupRepository = groupRepository;
        this.categoryRepository = categoryRepository;
        this.numberGenerator = numberGenerator;
    }

    @Transactional(readOnly = true)
    public Page<IncidentSummaryDto> list(IncidentStatus status, Priority priority,
                                         Long assigneeId, Long groupId, Boolean slaBreached,
                                         String search, Pageable pageable) {
        Specification<Incident> spec = Specification
                .where(IncidentSpecifications.status(status))
                .and(IncidentSpecifications.priority(priority))
                .and(IncidentSpecifications.assignee(assigneeId))
                .and(IncidentSpecifications.group(groupId))
                .and(IncidentSpecifications.slaBreached(slaBreached))
                .and(IncidentSpecifications.search(search));
        return incidentRepository.findAll(spec, pageable).map(IncidentMapper::toSummary);
    }

    @Transactional(readOnly = true)
    public IncidentDetailDto get(Long id) {
        Incident incident = findIncident(id);
        return toDetail(incident);
    }

    @Transactional
    public IncidentDetailDto create(CreateIncidentRequest req) {
        Incident incident = new Incident();
        incident.setNumber(numberGenerator.next());
        incident.setTitle(req.title());
        incident.setDescription(req.description());
        incident.setImpact(req.impact());
        incident.setUrgency(req.urgency());
        incident.setPriority(Priority.fromMatrix(req.impact(), req.urgency()));
        incident.setCategory(resolveCategory(req.categoryId()));
        incident.setReporter(resolveUser(req.reporterId()));

        AppUser assignee = resolveUser(req.assigneeId());
        SupportGroup group = resolveGroup(req.assignedGroupId());
        incident.setAssignee(assignee);
        incident.setAssignedGroup(group);
        incident.setStatus(assignee != null ? IncidentStatus.ASSIGNED : IncidentStatus.NEW);

        incident.setSlaDueAt(OffsetDateTime.now()
                .plusHours(incident.getPriority().getResolutionHours()));

        Incident saved = incidentRepository.save(incident);
        return toDetail(saved);
    }

    @Transactional
    public IncidentDetailDto update(Long id, UpdateIncidentRequest req) {
        Incident incident = findIncident(id);
        AppUser actor = null; // wired to authenticated principal once Keycloak is enforced

        if (req.title() != null) {
            incident.setTitle(req.title());
        }
        if (req.description() != null) {
            incident.setDescription(req.description());
        }

        boolean priorityInputsChanged = false;
        if (req.impact() != null && req.impact() != incident.getImpact()) {
            logActivity(incident, actor, "impact",
                    incident.getImpact().name(), req.impact().name());
            incident.setImpact(req.impact());
            priorityInputsChanged = true;
        }
        if (req.urgency() != null && req.urgency() != incident.getUrgency()) {
            logActivity(incident, actor, "urgency",
                    incident.getUrgency().name(), req.urgency().name());
            incident.setUrgency(req.urgency());
            priorityInputsChanged = true;
        }
        if (priorityInputsChanged) {
            Priority recomputed = Priority.fromMatrix(incident.getImpact(), incident.getUrgency());
            if (recomputed != incident.getPriority()) {
                logActivity(incident, actor, "priority",
                        incident.getPriority().name(), recomputed.name());
                incident.setPriority(recomputed);
            }
        }

        if (req.categoryId() != null) {
            incident.setCategory(resolveCategory(req.categoryId()));
        }

        if (req.assigneeId() != null) {
            AppUser newAssignee = resolveUser(req.assigneeId());
            if (!Objects.equals(idOf(incident.getAssignee()), newAssignee.getId())) {
                logActivity(incident, actor, "assignee",
                        nameOf(incident.getAssignee()), newAssignee.getFullName());
                incident.setAssignee(newAssignee);
                if (incident.getStatus() == IncidentStatus.NEW) {
                    incident.setStatus(IncidentStatus.ASSIGNED);
                }
            }
        }

        if (req.assignedGroupId() != null) {
            SupportGroup newGroup = resolveGroup(req.assignedGroupId());
            incident.setAssignedGroup(newGroup);
        }

        if (req.resolution() != null) {
            incident.setResolution(req.resolution());
        }

        if (req.status() != null && req.status() != incident.getStatus()) {
            applyStatusTransition(incident, req.status(), actor);
        }

        Incident saved = incidentRepository.save(incident);
        return toDetail(saved);
    }

    private void applyStatusTransition(Incident incident, IncidentStatus target, AppUser actor) {
        IncidentStatus current = incident.getStatus();
        if (!current.canTransitionTo(target)) {
            throw new BadRequestException(
                    "Illegal status transition: " + current + " -> " + target
                    + ". Allowed: " + current.allowedNext());
        }
        if (target == IncidentStatus.RESOLVED) {
            if (incident.getResolution() == null || incident.getResolution().isBlank()) {
                throw new BadRequestException("A resolution is required to resolve an incident.");
            }
            incident.setResolvedAt(OffsetDateTime.now());
        }
        if (target == IncidentStatus.CLOSED) {
            incident.setClosedAt(OffsetDateTime.now());
        }
        logActivity(incident, actor, "status", current.name(), target.name());
        incident.setStatus(target);
    }

    @Transactional(readOnly = true)
    public List<CommentDto> listComments(Long incidentId) {
        findIncident(incidentId);
        return commentRepository.findByIncidentIdOrderByCreatedAtAsc(incidentId).stream()
                .map(IncidentMapper::toCommentDto)
                .toList();
    }

    @Transactional
    public CommentDto addComment(Long incidentId, CreateCommentRequest req) {
        Incident incident = findIncident(incidentId);
        IncidentComment comment = new IncidentComment();
        comment.setIncident(incident);
        comment.setBody(req.body());
        comment.setInternal(req.internal());
        comment.setAuthor(resolveUser(req.authorId()));
        return IncidentMapper.toCommentDto(commentRepository.save(comment));
    }

    @Transactional(readOnly = true)
    public DashboardStatsDto stats() {
        long total = incidentRepository.count();
        long resolved = incidentRepository.countByStatus(IncidentStatus.RESOLVED)
                + incidentRepository.countByStatus(IncidentStatus.CLOSED);
        long breached = incidentRepository.countBySlaBreachedTrue();

        java.util.Map<String, Long> byStatus = new java.util.LinkedHashMap<>();
        for (IncidentStatus s : IncidentStatus.values()) {
            byStatus.put(s.name(), incidentRepository.countByStatus(s));
        }
        java.util.Map<String, Long> byPriority = new java.util.LinkedHashMap<>();
        for (Priority p : Priority.values()) {
            byPriority.put(p.name(), incidentRepository.countByPriority(p));
        }
        long open = total - resolved;
        return new DashboardStatsDto(total, open, resolved, breached, byStatus, byPriority);
    }

    // --- helpers -----------------------------------------------------------

    private Incident findIncident(Long id) {
        return incidentRepository.findById(id)
                .orElseThrow(() -> NotFoundException.of("Incident", id));
    }

    private AppUser resolveUser(Long id) {
        if (id == null) {
            return null;
        }
        return userRepository.findById(id)
                .orElseThrow(() -> NotFoundException.of("User", id));
    }

    private SupportGroup resolveGroup(Long id) {
        if (id == null) {
            return null;
        }
        return groupRepository.findById(id)
                .orElseThrow(() -> NotFoundException.of("SupportGroup", id));
    }

    private Category resolveCategory(Long id) {
        if (id == null) {
            return null;
        }
        return categoryRepository.findById(id)
                .orElseThrow(() -> NotFoundException.of("Category", id));
    }

    private void logActivity(Incident incident, AppUser actor,
                             String field, String oldValue, String newValue) {
        IncidentActivity activity = new IncidentActivity();
        activity.setIncident(incident);
        activity.setActor(actor);
        activity.setField(field);
        activity.setOldValue(oldValue);
        activity.setNewValue(newValue);
        activityRepository.save(activity);
    }

    private IncidentDetailDto toDetail(Incident incident) {
        List<CommentDto> comments = commentRepository
                .findByIncidentIdOrderByCreatedAtAsc(incident.getId()).stream()
                .map(IncidentMapper::toCommentDto)
                .toList();
        List<ActivityDto> activity = activityRepository
                .findByIncidentIdOrderByCreatedAtDesc(incident.getId()).stream()
                .map(IncidentMapper::toActivityDto)
                .toList();
        return IncidentMapper.toDetail(incident, comments, activity);
    }

    private static Long idOf(AppUser user) {
        return user == null ? null : user.getId();
    }

    private static String nameOf(AppUser user) {
        return user == null ? null : user.getFullName();
    }
}

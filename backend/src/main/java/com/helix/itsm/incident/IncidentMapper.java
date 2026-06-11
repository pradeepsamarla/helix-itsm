package com.helix.itsm.incident;

import com.helix.itsm.category.Category;
import com.helix.itsm.incident.dto.*;
import com.helix.itsm.user.AppUser;
import com.helix.itsm.user.SupportGroup;

import java.util.List;

public final class IncidentMapper {

    private IncidentMapper() {
    }

    public static RefDto ref(AppUser user) {
        return user == null ? null : new RefDto(user.getId(), user.getFullName());
    }

    public static RefDto ref(SupportGroup group) {
        return group == null ? null : new RefDto(group.getId(), group.getName());
    }

    public static RefDto ref(Category category) {
        return category == null ? null : new RefDto(category.getId(), category.getName());
    }

    public static IncidentSummaryDto toSummary(Incident i) {
        return new IncidentSummaryDto(
                i.getId(),
                i.getNumber(),
                i.getTitle(),
                i.getStatus(),
                i.getPriority(),
                i.getImpact(),
                i.getUrgency(),
                ref(i.getCategory()),
                ref(i.getAssignee()),
                ref(i.getAssignedGroup()),
                i.getSlaDueAt(),
                i.isSlaBreached(),
                i.getCreatedAt(),
                i.getUpdatedAt()
        );
    }

    public static IncidentDetailDto toDetail(Incident i,
                                             List<CommentDto> comments,
                                             List<ActivityDto> activity) {
        return new IncidentDetailDto(
                i.getId(),
                i.getNumber(),
                i.getTitle(),
                i.getDescription(),
                i.getStatus(),
                List.copyOf(i.getStatus().allowedNext()),
                i.getPriority(),
                i.getImpact(),
                i.getUrgency(),
                ref(i.getCategory()),
                ref(i.getReporter()),
                ref(i.getAssignee()),
                ref(i.getAssignedGroup()),
                i.getResolution(),
                i.getSlaDueAt(),
                i.isSlaBreached(),
                i.getCreatedAt(),
                i.getUpdatedAt(),
                i.getResolvedAt(),
                i.getClosedAt(),
                comments,
                activity
        );
    }

    public static CommentDto toCommentDto(IncidentComment c) {
        return new CommentDto(
                c.getId(),
                ref(c.getAuthor()),
                c.getBody(),
                c.isInternal(),
                c.getCreatedAt()
        );
    }

    public static ActivityDto toActivityDto(IncidentActivity a) {
        return new ActivityDto(
                a.getId(),
                ref(a.getActor()),
                a.getField(),
                a.getOldValue(),
                a.getNewValue(),
                a.getCreatedAt()
        );
    }
}

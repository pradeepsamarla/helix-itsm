package com.helix.itsm.reference;

import com.helix.itsm.category.CategoryRepository;
import com.helix.itsm.incident.IncidentMapper;
import com.helix.itsm.incident.Level;
import com.helix.itsm.incident.dto.RefDto;
import com.helix.itsm.user.UserRepository;
import com.helix.itsm.user.SupportGroupRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;

/**
 * Reference data used to populate selectors in the UI.
 */
@RestController
@RequestMapping("/api/reference")
public class ReferenceController {

    private final UserRepository userRepository;
    private final SupportGroupRepository groupRepository;
    private final CategoryRepository categoryRepository;

    public ReferenceController(UserRepository userRepository,
                               SupportGroupRepository groupRepository,
                               CategoryRepository categoryRepository) {
        this.userRepository = userRepository;
        this.groupRepository = groupRepository;
        this.categoryRepository = categoryRepository;
    }

    @GetMapping("/users")
    public List<RefDto> users() {
        return userRepository.findAll().stream().map(IncidentMapper::ref).toList();
    }

    @GetMapping("/groups")
    public List<RefDto> groups() {
        return groupRepository.findAll().stream().map(IncidentMapper::ref).toList();
    }

    @GetMapping("/categories")
    public List<RefDto> categories() {
        return categoryRepository.findAll().stream().map(IncidentMapper::ref).toList();
    }

    @GetMapping("/levels")
    public List<String> levels() {
        return Arrays.stream(Level.values()).map(Enum::name).toList();
    }
}

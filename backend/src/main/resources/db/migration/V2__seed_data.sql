-- Seed reference data so the pilot is usable immediately.

INSERT INTO support_group (name, description) VALUES
    ('Service Desk',        'First line support / triage'),
    ('Network Operations',  'Network and connectivity'),
    ('Infrastructure',      'Servers, storage, virtualization'),
    ('Application Support', 'Business applications');

INSERT INTO app_user (username, email, full_name, role, group_id) VALUES
    ('admin',    'admin@helix.local',    'System Administrator', 'ADMIN',   1),
    ('agent1',   'agent1@helix.local',   'Alice Agent',          'AGENT',   1),
    ('agent2',   'agent2@helix.local',   'Bob Agent',            'AGENT',   2),
    ('agent3',   'agent3@helix.local',   'Carol Agent',          'AGENT',   3),
    ('user1',    'user1@helix.local',    'Dave User',            'END_USER', NULL),
    ('user2',    'user2@helix.local',    'Erin User',            'END_USER', NULL);

INSERT INTO category (name, parent_id) VALUES
    ('Hardware', NULL),
    ('Software', NULL),
    ('Network',  NULL),
    ('Access',   NULL);
INSERT INTO category (name, parent_id) VALUES
    ('Laptop',          1),
    ('Printer',         1),
    ('Operating System',2),
    ('Email',           2),
    ('VPN',             3),
    ('Password Reset',  4);

-- A couple of example incidents.
INSERT INTO incident (number, title, description, status, impact, urgency, priority,
                      category_id, reporter_id, assignee_id, assigned_group_id, sla_due_at)
VALUES
    ('INC0000001', 'Cannot connect to VPN',
     'User reports VPN client fails to authenticate since this morning.',
     'IN_PROGRESS', 'HIGH', 'HIGH', 'CRITICAL',
     9, 5, 2, 2, now() + interval '4 hours'),
    ('INC0000002', 'Outlook crashes on launch',
     'Outlook closes immediately after opening on a Windows laptop.',
     'NEW', 'MEDIUM', 'MEDIUM', 'MEDIUM',
     8, 6, NULL, 1, now() + interval '24 hours');

SELECT setval('incident_number_seq', 2, true);

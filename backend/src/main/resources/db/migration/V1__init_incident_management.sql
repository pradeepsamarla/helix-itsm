-- Helix ITSM :: Incident Management core schema
-- Reference data, users/groups, incidents, work notes and an activity log.

CREATE TABLE support_group (
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(120) NOT NULL UNIQUE,
    description VARCHAR(500),
    active      BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE TABLE app_user (
    id          BIGSERIAL PRIMARY KEY,
    username    VARCHAR(120) NOT NULL UNIQUE,
    email       VARCHAR(255) NOT NULL UNIQUE,
    full_name   VARCHAR(200) NOT NULL,
    role        VARCHAR(20)  NOT NULL DEFAULT 'END_USER',
    group_id    BIGINT       REFERENCES support_group (id),
    active      BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT now()
);
CREATE INDEX idx_app_user_group ON app_user (group_id);

CREATE TABLE category (
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(120) NOT NULL,
    parent_id   BIGINT REFERENCES category (id),
    active      BOOLEAN      NOT NULL DEFAULT TRUE
);
CREATE INDEX idx_category_parent ON category (parent_id);

CREATE TABLE incident (
    id               BIGSERIAL PRIMARY KEY,
    number           VARCHAR(20)  NOT NULL UNIQUE,
    title            VARCHAR(250) NOT NULL,
    description      TEXT,
    status           VARCHAR(20)  NOT NULL DEFAULT 'NEW',
    impact           VARCHAR(10)  NOT NULL DEFAULT 'MEDIUM',
    urgency          VARCHAR(10)  NOT NULL DEFAULT 'MEDIUM',
    priority         VARCHAR(10)  NOT NULL DEFAULT 'MEDIUM',
    category_id      BIGINT REFERENCES category (id),
    reporter_id      BIGINT REFERENCES app_user (id),
    assignee_id      BIGINT REFERENCES app_user (id),
    assigned_group_id BIGINT REFERENCES support_group (id),
    resolution       TEXT,
    sla_due_at       TIMESTAMPTZ,
    sla_breached     BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at       TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at       TIMESTAMPTZ  NOT NULL DEFAULT now(),
    resolved_at      TIMESTAMPTZ,
    closed_at        TIMESTAMPTZ
);
CREATE INDEX idx_incident_status   ON incident (status);
CREATE INDEX idx_incident_priority ON incident (priority);
CREATE INDEX idx_incident_assignee ON incident (assignee_id);
CREATE INDEX idx_incident_group    ON incident (assigned_group_id);
CREATE INDEX idx_incident_created  ON incident (created_at);

CREATE TABLE incident_comment (
    id          BIGSERIAL PRIMARY KEY,
    incident_id BIGINT      NOT NULL REFERENCES incident (id) ON DELETE CASCADE,
    author_id   BIGINT      REFERENCES app_user (id),
    body        TEXT        NOT NULL,
    internal    BOOLEAN     NOT NULL DEFAULT FALSE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_comment_incident ON incident_comment (incident_id);

CREATE TABLE incident_activity (
    id          BIGSERIAL PRIMARY KEY,
    incident_id BIGINT      NOT NULL REFERENCES incident (id) ON DELETE CASCADE,
    actor_id    BIGINT      REFERENCES app_user (id),
    field       VARCHAR(60) NOT NULL,
    old_value   VARCHAR(500),
    new_value   VARCHAR(500),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_activity_incident ON incident_activity (incident_id);

-- Sequence used to generate human-friendly incident numbers (INC0000001 ...)
CREATE SEQUENCE incident_number_seq START WITH 1 INCREMENT BY 1;

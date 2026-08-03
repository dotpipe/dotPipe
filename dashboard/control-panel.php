<?php
header('Content-Type: application/json; charset=utf-8');
echo json_encode([
    'name' => 'XI Control Panel',
    'version' => 1,
    'surfaces' => ['xi', 'endpoints', 'audit', 'tiers', 'json', 'attributes', 'files'],
    'tiers' => [
        ['id' => 'shared-hosting', 'name' => 'Shared Hosting', 'description' => 'Safely bounded per-user service for shared infrastructure.', 'capabilities' => ['status', 'audit', 'read', 'request', 'pause', 'resume'], 'limits' => ['endpoints' => 10, 'apiDefinitions' => 25, 'requestsPerMinute' => 300, 'writesPerHour' => 10, 'maxFileBytes' => 262144, 'storageBytes' => 10485760, 'auditRetentionDays' => 7, 'customXIRules' => false, 'endpointCreation' => false]],
        ['id' => 'managed-vps', 'name' => 'Managed VPS', 'description' => 'More control with bounded service protection.', 'capabilities' => ['status', 'audit', 'read', 'request', 'pause', 'resume', 'json-edit', 'create'], 'limits' => ['endpoints' => 100, 'apiDefinitions' => 250, 'requestsPerMinute' => 3000, 'writesPerHour' => 120, 'maxFileBytes' => 2097152, 'storageBytes' => 1073741824, 'auditRetentionDays' => 30, 'customXIRules' => true, 'endpointCreation' => true]],
        ['id' => 'dedicated', 'name' => 'Dedicated', 'description' => 'Full operator control subject to server policy.', 'capabilities' => ['status', 'audit', 'read', 'request', 'pause', 'resume', 'json-edit', 'create', 'remove', 'write', 'rule-edit'], 'limits' => ['endpoints' => 1000, 'apiDefinitions' => 2500, 'requestsPerMinute' => 30000, 'writesPerHour' => 1200, 'maxFileBytes' => 16777216, 'storageBytes' => 10737418240, 'auditRetentionDays' => 365, 'customXIRules' => true, 'endpointCreation' => true]],
    ],
    'normalizedResponses' => [200, 201, 202, 204, 400, 401, 403, 404, 409, 429, 500, 503],
    'xiKeys' => ['root', 'auditLog', 'stateFile', 'endpointEntry', 'allowWrites', 'maxBytes', 'clockSkewSeconds', 'keys', 'allow', 'deny'],
], JSON_PRETTY_PRINT);

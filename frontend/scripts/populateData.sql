-- Insert mock data into User table
INSERT INTO "User" (id, username, hashed_password, email)
    VALUES ('cceae8f8-042e-44a4-9139-799fbee1cbbb', 'user1', 'hashedPassword1', 'user1@example.com');

-- Insert mock data into Chat table
INSERT INTO "Chat" (id, title, is_public, created_by)
    VALUES ('8811273e-9795-475e-95f0-bfa347aac73d', 'Chat 1', TRUE, 'cceae8f8-042e-44a4-9139-799fbee1cbbb'),
    ('4219d8b6-3ac5-405b-9240-39c29a3cb352', 'Chat 2', FALSE, 'cceae8f8-042e-44a4-9139-799fbee1cbbb');

-- Insert mock data into LLM table
INSERT INTO "LLM" (id, name)
    VALUES ('42ee09d2-0ef7-4586-980f-8ef724316d53', 'LLM Model 1'),
    ('9066c380-b7b7-46de-ade3-0ec581835626', 'LLM Model 2');

-- Insert mock data into LLMResponse table
INSERT INTO "LLMResponse" (id, chat, llm, question, answer)
    VALUES ('65524e9b-3e82-4a83-b15c-e1e19d4f05b3', '8811273e-9795-475e-95f0-bfa347aac73d', '42ee09d2-0ef7-4586-980f-8ef724316d53', 'What is AI?', 'Artificial Intelligence.'),
    ('2bc8ed32-dcad-4afe-b71b-d91bb5cbb2a9', '4219d8b6-3ac5-405b-9240-39c29a3cb352', '9066c380-b7b7-46de-ade3-0ec581835626', 'What is ML?', 'Machine Learning.'),
    ('2c37e2be-1364-4c8b-9500-244bff14eea8', '4219d8b6-3ac5-405b-9240-39c29a3cb352', '9066c380-b7b7-46de-ade3-0ec581835626', 'Why is ML 2 ?', 'Just Cuz');


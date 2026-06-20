# MongoDB and Redis Models

## MongoDB: `activities`

Stores quiz/activity content from the PDF's Activity, Question, AnswerOption, Resource, Standard, and Accommodation concepts.

```json
{
  "_id": "QZ-SCIENCE-001",
  "type": "QUIZ",
  "title": "Science Systems Check",
  "subject": "Science",
  "grade": "Grade 8",
  "status": "Published",
  "createdBy": "USR-TEACHER",
  "standards": ["MS-LS1-6"],
  "accommodations": ["Extended time", "Read-aloud"],
  "questions": [
    {
      "id": "Q-001",
      "text": "Which planet is known as the Red Planet?",
      "options": ["Earth", "Mars", "Jupiter", "Venus"],
      "correct": "Mars"
    }
  ]
}
```

## Redis

- `leaderboard:{sessionId}`: sorted set for live session score tracking.
- Future cache keys can hold session state, frequently accessed resources, and report summaries.

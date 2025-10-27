### Project Requirements

Account:
Required(System): Userid, username, name
Required(User Given): Twitter, discord, cmc, linkedin
Optional: Profile, image

## Database Schema:

### User

Account:

- \_id: ObjectId (Primary Key)
- userid: Number (Required)
- username: String (Required)
- name: String (Required)
- isBlock: Boolean (Default: false)
- isDeleted: Boolean (Default: false)
- createdAt: Date (Default: now)
- updatedAt: Date (Default: now)

Social Media:

- \_id: ObjectId (Primary Key)
- User: AccountId(objectId)
- twitter: String (User Given)
- discord: String (User Given)
- cmc: String (User Given)
- linkedin: String (User Given)
- isBlock: Boolean (Default: false)
- isDeleted: Boolean (Default: false)
- createdAt: Date (Default: now)
- updatedAt: Date (Default: now)

Point System:

- \_id: ObjectId (Primary Key)
- User: AccountId(objectId)
- points: Number (Default: 0)
- createdAt: Date (Default: now)
- updatedAt: Date (Default: now)

### Task

Task info:

- \_id: ObjectId (Primary Key),
- title: String (Required),
- points: Number (Required),
- category: String (Required),
- startedAt: Date (Required),
- endedAt: Date (Required),
- createdAt: Date (Default: now),
- updatedAt: Date (Default: now)

### Task completed user list

- \_id: ObjectId (Primary Key),
- userId: ObjectId (Reference to User),
  completedTaskId: ObjectId (Reference to Task),
- createdAt: Date (Default: now),
- updatedAt: Date (Default: now)

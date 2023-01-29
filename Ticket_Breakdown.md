# Ticket Breakdown
We are a staffing company whose primary purpose is to book Agents at Shifts posted by Facilities on our platform. We're working on a new feature which will generate reports for our client Facilities containing info on how many hours each Agent worked in a given quarter by summing up every Shift they worked. Currently, this is how the process works:

- Data is saved in the database in the Facilities, Agents, and Shifts tables
- A function `getShiftsByFacility` is called with the Facility's id, returning all Shifts worked that quarter, including some metadata about the Agent assigned to each
- A function `generateReport` is then called with the list of Shifts. It converts them into a PDF which can be submitted by the Facility for compliance.

## You've been asked to work on a ticket. It reads:

**Currently, the id of each Agent on the reports we generate is their internal database id. We'd like to add the ability for Facilities to save their own custom ids for each Agent they work with and use that id when generating reports for them.**


Based on the information given, break this ticket down into 2-5 individual tickets to perform. Provide as much detail for each ticket as you can, including acceptance criteria, time/effort estimates, and implementation details. Feel free to make informed guesses about any unknown details - you can't guess "wrong".


You will be graded on the level of detail in each ticket, the clarity of the execution plan within and between tickets, and the intelligibility of your language. You don't need to be a native English speaker, but please proof-read your work.

## Your Breakdown Here

### Task 1

Task name
Create new database table for a new mapping of Facilities to custom Agent IDs. 

Implementation details
- Table name: FacilityOverride. 
- Table structure:

| FacilityId  | OverrideValueId | OverrideValueType | OverrideValue |
|-------------|-----------------|-------------------|---------------|
| VARCHAR(36) | VARCHAR(100)    | AGENT_ID          | VARCHAR(200)  |

We will create a generic override table which can be used to override any value (not just AGENT_ID) in the future. For current use case it will be used to override only the AgentId. The OverrideValueType will denote which value is being overridden by the facility. In the future it can also be used to override attributes such as SHIFT_ID. We should also set foreign key on FacilityId so that the corresponding entries in this table get deleted if the Facility is deleted. 

Column descriptions: 

	- FacilityId - foreign key pointing to ID of Facility table. Also primary key of this table
	- OverrideValueId - ID of attribute being overridden (here it will be AgentId). Secondary key of this table
	- OverrideValueType - Enum Type of value being overridden (here it will be AGENT_ID to denote that the OverrideValueId is an ID of the Agent table)
	- OverrideValue - The value of the overriden value type. Here it will be the Custom AgentId provided by the Facility

Assumptions
- Custom Agent IDs per Agent are required only at Facility level, and not at Shift level. This is the basis of keeping FacilityId as primary key of this table.
- Spring boot with JPA Hibernate is used to create tables automatically when the database table entity is specified
- OverrideValue cannot be more than 200 characters long (string). 
- OverrideValueId (AgentId) will fit in VARCHAR(100) for all possible override-able attributes

Completion Criteria
- Table present in all environments (dev/beta/prod) 
- Database entities present in the code and connection to the new table is verified. 
- Script to revert table creation if something goes wrong should be present and tested.
- Deployment and revert plan should be created and reviewed with team.

Effort (story points): 3

### Task 2

Task name
Create DAO layer for new FacilityOverride table

Implementation details
- Create DAO layer in code
- Write unit tests

Assumptions
- Tables and Entity objects in code are already set up

Completion Criteria
- Build is successful with new unit tests 
- Set up golden metrics (Latency, TPS, ErrorCount).
- Dashboards present for these metrics

Effort (story points): 2

### Task 3

Task name
Create POST API to create new entry in the FacilityOverride table

Implementation details
- API input shape and response shape

Request:
```
POST /facility/override
{
	"facilityId": "<FacilityId UUID>",
	"overrideValueId": "<AgentId in this case. AgentId UUID>",
	"overrideValueType": "AGENT_ID. Enum",
	"overrideValue": "<CustomAgentId. String>"
}
```

Response:
```
201 OK in case of successful create
400 in case facilityId or overrideValueType is not correct
401 in case of invalid/absent credentials
403 in case of valid credentials but insufficient permissions
Other HTTP status codes as per requirement (5xx for ISE, 429 for throttling, etc)
```

- Create Controller and Service layer for API in code
- Write unit tests
- Write new integration tests - both success and failure cases. Failure case can contain cases like Facility or Agent does not exist.
- Documentation for integrating with this API for external customers.

Assumptions
- Tables and Entity objects in code already set up

Completion Criteria
- Build successful with new unit tests 
- Set up golden metrics (Latency, TPS, ErrorCount) and dashboard for API. Metrics should be emitted for new table/DAO operations 
- Dashboards present for these metrics
- Integration tests passing for new API
- Client level throttling to be set up (should already be present, just plug in new API there)
- Documentation created for integrating with new API for external customers.

Effort (story points): 3

### Task 4

Task name
Update code in generateReport to use Agent IDs from new FacilityOverride table

Implementation details
- Update code in generateReport() function to query FacilityOverride table by FacilityId + AgentId for each Shift, and use the AgentId returned from that query. Fall back to existing AgentId present in Shift metadata if not present in FacilityOverride table.
- Write unit tests
- Write new integration tests - both success and failure case. Failure case can contain cases like Facility or Agent does not exist.

Assumptions
- Integration tests exist for API which uses the generateReport() function

Completion Criteria
- Build successful with new unit tests 
- Integration tests passing for new API

Effort (story points): 2









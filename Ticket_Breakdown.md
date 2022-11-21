# Ticket Breakdown

We are a staffing company whose primary purpose is to book Agents at Shifts posted by Facilities on our platform. We're working on a new feature which will generate reports for our client Facilities containing info on how many hours each Agent worked in a given quarter by summing up every Shift they worked. Currently, this is how the process works:

-   Data is saved in the database in the Facilities, Agents, and Shifts tables
-   A function `getShiftsByFacility` is called with the Facility's id, returning all Shifts worked that quarter, including some metadata about the Agent assigned to each
-   A function `generateReport` is then called with the list of Shifts. It converts them into a PDF which can be submitted by the Facility for compliance.

## You've been asked to work on a ticket. It reads:

**Currently, the id of each Agent on the reports we generate is their internal database id. We'd like to add the ability for Facilities to save their own custom ids for each Agent they work with and use that id when generating reports for them.**

Based on the information given, break this ticket down into 2-5 individual tickets to perform. Provide as much detail for each ticket as you can, including acceptance criteria, time/effort estimates, and implementation details. Feel free to make informed guesses about any unknown details - you can't guess "wrong".

You will be graded on the level of detail in each ticket, the clarity of the execution plan within and between tickets, and the intelligibility of your language. You don't need to be a native English speaker, but please proof-read your work.

## Your Breakdown Here

### Sub-tickets

1. Add `agentId` column to database table

    - ASSUMPTIONS: Data is currently stored in a relational database, and `agentId` does not need to be stored outside of the Agents table - the internal ID is part of the Shifts schema, so the custom ID can be retreived from that if needed
    - Decide on agent ID format (I'll go with 1-255 chars alphanumeric with underscores and hyphens, but of course this will likely depend on the users, existing reports, etc. and not be solely up to the engineer)
    - Add `agentId` to db schema for Agents table
    - Default to NULL if not given (or if migrating existing data)
    - Test migration on staging db
    - Migrate production db
    - `agentId` column will not be read by anything at this stage and will be NULL for every entry
    - Time estimate: 2 hrs.

2. Allow facilities to add custom IDs to existing Agents

    - ASSUMPTIONS: There is already a CRUD for Facilities to work with their Agents, e.g. an admin dashboard, and an authorization flow already exists
    - Add an auth-enabled API endpoint for updating `agentId` column for a given Agent, with input validation for length and characters used
    - Design UX flow for adding/editing custom ID for a given agent (likely using existing "Edit Agent")
    - Implement custom ID editing on the frontend
    - Add test cases for editing agent ID, trying valid, invalid, and not giving an ID
    - Test in staging env
    - Time estimate: 4 hrs - 1 day

3. Prompt for agent ID when creating new Agent

    - ASSUMPTIONS: There is already an API-based flow for Facilities to create Agents and add them to our database
    - Update API endpoint to expect optional `agentId` field, defaulting to NULL if it is not given
    - Add field to frontend for agent ID when creating Agents
    - Add test cases for creating new agents with and without IDs, and with valid and invalid ones
    - Test creation flow in staging, and agent ID editing
    - Time estimate: 2 - 4 hrs.
    - **Note**: there is a lot of overlap between 2 and 3 here, and you could argue that they should be done at the same time rather than separately. I've separated them because they're distinct bits of functionality, and this way Facilities can edit their Agents quicker. I've also put them in this order because editing existing Agents is more important - if the ID could _only_ be set on creation, then the Facility making a typo or similar error would be drastic (and result in more support tickets). I think in practice whether these two tasks are separated or together would depend on a lot of factors such as deploy time and specific user needs.

4. Update report generation
    - ASSUMPTIONS: We've already spoken with users about why this custom ID is needed, and they are aware it exists and what it is for
    - Update `getShiftsByFacility` to retreive `agentId` from the database along with the existing fields (this would be added to the part that gets "metadata about the Agent" from a given Shift)
    - Discuss how to handle edge cases - what if only some agents have custom IDs? What if the IDs are too long to display correctly?
        - In this case I'll say to simply display the custom ID if it exists, and the internal ID if not, and to wrap the ID if it's longer than 40 chars, as its max is 255 which shouldn't be long enough to completely break the formatting. In practice I think these (especially the first one) should be discussed with other team members before deployment
    - update `generateReport` to take a list that includes the custom ID as part of the Agent metadata, and put it in the report if it exists
    - Add test cases for report generation with new configurations of data (agents with custom IDs, agents without, agents with some-but-not-all custom IDs, agents with invalid custom IDs, agents with very long custom IDs)
    - Test end-to-end user story (add agents with custom IDs, edit the IDs, generate report)
    - Ensure the clarity and quality of the reports are equal or better than before the change
      Time estimate: 1 - 2 days

Throughout this process, users should be kept informed of the new options they have regarding custom IDs, particularly after the deployment of steps 2, 3, and 4. That may or may not be the engineer's responsibility depending on the structure of the team, but I thought it was worth mentioning.

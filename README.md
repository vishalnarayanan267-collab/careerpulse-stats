# Career Compass

IMPORTANT: BUILD THE COMPLETE PROTOTYPE IN THIS SINGLE IMPLEMENTATION.



I have a very limited generation budget, so do NOT create a partial implementation and do NOT stop halfway.



Do NOT ask me to say "continue".



Complete the entire frontend prototype now.



PROJECT

-------



Name: CareerPulse



Problem Statement:

SIH26135 — Employment Outcomes Tracking



Purpose:

A college/institutional analytics dashboard that helps placement officers and institutions understand graduate employment outcomes, compare departments, identify trends and discover areas that need intervention.



THIS IS A FRONTEND-ONLY HACKATHON PROTOTYPE.



DO NOT BUILD:

- backend

- Firebase

- Supabase

- database

- authentication

- external APIs

- external AI APIs

- payment system

- complex admin system



Use ONLY local deterministic mock data inside the frontend.



TECHNOLOGY

----------



Use the existing project technology and libraries where possible.



Prefer:

- React

- TypeScript

- Tailwind CSS

- Recharts

- Lucide icons



Do not introduce unnecessary dependencies.



CORE REQUIREMENT

----------------



The application must be COMPLETE and RUNNING after this generation.



Do not leave:

- empty pages

- placeholder charts

- TODO comments

- fake navigation

- broken buttons

- unfinished components

- missing routes



Prioritize a polished working prototype over unnecessary architecture.



DATA

----



Create a realistic deterministic local dataset of approximately 100-150 graduate records.



Each graduate should contain:



- id

- name

- department

- graduationYear

- cgpa

- internship

- employmentStatus

- company

- role

- industry

- location

- salary

- timeToEmployment

- degreeRelevance

- higherStudies



Use realistic Indian student/company data.



Departments:

- Computer Science

- AI & ML

- Information Technology

- Electronics & Communication

- Electrical

- Mechanical

- Civil



Employment statuses:

- Employed

- Unemployed

- Higher Studies

- Self Employed



Do NOT make every student employed.



Create believable differences between departments, years and internship participation.



APPLICATION STRUCTURE

---------------------



Create a professional dashboard application with a persistent sidebar.



Sidebar:



CareerPulse



Dashboard

Graduate Explorer

Insights



Bottom:

SIH26135

Employment Outcomes



PAGE 1 — DASHBOARD

------------------



This is the most important screen.



Header:



Employment Outcomes Dashboard



Subtitle:



Track graduate employment, career outcomes and institutional trends.



Add a compact filter bar:



Graduation Year

Department

Employment Status

Industry



Filters must actually work.



When filters change, KPI values and charts must update.



KPI CARDS

---------



Create six attractive KPI cards:



1. Total Graduates

2. Employment Rate

3. Average Starting Salary

4. Average Time to Employment

5. Higher Studies

6. Degree-Relevant Employment



Calculate these values from the local dataset.



CHARTS

------



Create six interactive charts using Recharts:



1. Employment Status

   Donut/Pie chart



2. Employment Rate by Department

   Horizontal bar chart



3. Employment Trend by Graduation Year

   Line chart



4. Starting Salary Distribution

   Bar chart



5. Time to Employment

   Bar chart



6. Degree Relevance

   Donut or bar chart



Charts should have:

- clear labels

- tooltips

- legends where useful

- responsive containers

- professional styling



Add a small "Key Takeaway" section below the charts showing 2-3 automatically calculated observations.



PAGE 2 — GRADUATE EXPLORER

--------------------------



Header:



Graduate Explorer



Subtitle:



Search and explore individual graduate employment outcomes.



Create:



Search input



Department filter



Graduation year filter



Employment status filter



Create a polished table with:



Student

Department

Year

Status

Company

Role

Salary

Time to Employment



Use status badges.



Clicking a row opens a detailed graduate profile modal.



PROFILE MODAL

-------------



Show:



Student name

Student ID

Department

Graduation year

CGPA

Internship status

Employment status

Company

Role

Industry

Location

Starting salary

Time to employment

Degree relevance

Higher studies



Make this visually polished.



PAGE 3 — INSIGHTS

-----------------



Header:



Employment Insights



Subtitle:



Turn graduate outcomes into actionable institutional decisions.



Create three sections:



POSITIVE TRENDS



Show 2-3 automatically generated observations.



ATTENTION REQUIRED



Show 2-3 areas that need attention.



RECOMMENDATIONS



Show 2-3 practical recommendations based on the dataset.



Examples:



"AI & ML graduates show a stronger employment rate than the institutional average."



"Graduates with internship experience have better employment outcomes."



"Some departments have longer time-to-employment."



"Increase industry-linked internship opportunities for departments with lower employment outcomes."



Do not use an external AI API.



Use simple rule-based calculations from the dataset.



DESIGN

------



The application must look like a modern premium analytics SaaS product suitable for a Smart India Hackathon presentation.



Design principles:



- clean

- professional

- modern

- minimal

- strong visual hierarchy

- excellent spacing

- rounded cards

- subtle shadows

- polished typography

- consistent icons

- attractive charts

- restrained professional color palette

- subtle hover animations

- smooth transitions

- responsive desktop layout

- usable mobile layout



Use a professional institutional/technology aesthetic.



Do NOT make it look like a generic template.



The dashboard should immediately communicate:



"Employment analytics platform for colleges."



IMPORTANT VISUAL DETAILS

------------------------



Use:



- persistent sidebar

- active navigation state

- polished page headers

- KPI cards with small supporting labels

- status badges

- chart cards

- consistent card radius

- consistent spacing

- empty states where appropriate

- hover states

- loading-free local experience



Avoid excessive gradients, excessive animations and visual clutter.



FUNCTIONAL DEMO FLOW

--------------------



This exact flow must work:



1. Open Dashboard.



2. Change Department filter.



3. KPI numbers update.



4. Charts update.



5. Navigate to Graduate Explorer.



6. Search for a graduate.



7. Click graduate.



8. Profile modal opens.



9. Navigate to Insights.



10. View Positive Trends, Attention Required and Recommendations.



All of this must work without a backend.



FINAL QUALITY CHECK

-------------------



Before finishing:



- Make sure the application compiles.

- Make sure all routes work.

- Make sure navigation works.

- Make sure filters work.

- Make sure charts render.

- Make sure the graduate modal works.

- Make sure there are no placeholder elements.

- Make sure the layout is polished.

- Make sure the prototype can be demonstrated immediately.



VERY IMPORTANT:



Do not expand the scope.



Do not add backend functionality.



Do not add authentication.



Do not add extra pages.



Do not wait for another prompt.



Complete the entire frontend prototype in this implementation.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://careerpulse-stats.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/ad9e30eb-9484-4c39-8f93-5d749439708d).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

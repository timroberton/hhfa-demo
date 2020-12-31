# To do

DONE -- Clean indicators and analysis lists
DONE -- Make good STRUCTURE data (good list of indicators, analyses, and stratifier names)
DONE -- Make video

DONE -- Upload video to Vimeo
-- Link Vimeo to docs page

-- Work on DOCS and github README

-- Re-deploy frontend
-- Copy frontend to hhfa-demo folder INCLUDING NEXT SOURCE FILES
-- Push hhfa-demo

-- Send email

---
---
---

- Need to think through the deployment strategy... at this stage, NO USERNAMES, but we DO want webapp (easily deployable), with a download/reload saving mechanism

- Make indicators reference varnames, and analyses reference indicatorNames... then hydrate structure before saving script

- Add different script for different analysis types

- Editor pages for...
STRATIFIERS
SURVEY DESIGN

- Add "demonimator" to analysisObj

## From Ashley

- Not just responseOptionIds... it's the LABELS/MEANING as well... how to check this?
- We should EXPECT different response options... e.g. Health facility types

- Cascading alignment of expected/actual... so if VAR is not as expected, should flag that IND and ANALYSIS are not as expected

- Multiple tables... should just be per-facility top-level table, but could also have a QoC provider-level / record review
- BUT THESE ARE EFFECTIVELY SEPARATE ANALYSIS... all the needed top-level vars are in the QoC table

## Stratifiers

- Admin level (geo)
- Urban/Rural/(Periurban)
- Facility type
- Managing authority (public/private)

- Double-check/rethink how to handle missing

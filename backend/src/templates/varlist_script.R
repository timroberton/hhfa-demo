options(warn=-1)

library(haven)
library(tibble)
library(jsonlite)
library(dplyr)

N_RESPONSE_OPTIONS_THRESHOLD <- 20

d <- read_dta('DATA_FILE_TO_ANALYZE.dta')

n <- names(d)

df <- tibble(
    variableName = character(), 
    variableType = character(),
    nResponseOptions = numeric(),
    responseOptions = character(),
)

for (i in 1:length(n)) {
    c1 <- class(d[[i]])
    c2 <- c1[length(c1)]

    nResOpts <- n_distinct(d[[i]])
    resOpts <- character()

    if (nResOpts < N_RESPONSE_OPTIONS_THRESHOLD) {
        u <- unique(d[[i]])
        if (c2 == "double" | c2 == "numeric") {
            u[is.na(u)] <- 999876
            u <- sort(u)
            resOpts <- as.character(toJSON(u))
        } else {
            # not sure...
            resOpts <- "[]"
        }
    } else {
        resOpts <- "[]"
    }

    df <- add_row(
        df, 
        variableName = n[i], 
        variableType = c2,
        nResponseOptions = nResOpts,
        responseOptions = resOpts,
    )
}

write_json(df, "VARLIST.json")
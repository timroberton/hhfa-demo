options(warn=-1)

library(haven)
library(tibble)
library(jsonlite)
library(dplyr)
library(rlang)

N_RESPONSE_OPTIONS_THRESHOLD <- 30

d <- read_dta('DATA_FILE_TO_ANALYZE.dta')

n <- names(d)

df <- tibble(
  variable_name = character(), 
  variable_label = character(),
  variable_type = character(),
  n_response_options = numeric(),
  response_option_actuals = character(),
  has_any_stata_labels = logical(),
  response_option_values = character(),
  response_option_labels = character(),
  n_missing = numeric(),
)

for (i in 1:length(n)) {
  c1 <- class(d[[i]])
  c2 <- c1[length(c1)]
  
  nResOpts <- n_distinct(d[[i]])
  nMiss <- sum(is.na(d[[i]]))
  
  resOptActs <- "[]"
  resOptVals <- "[]"
  resOptLabs <- "[]"
  
  stataLabs <- is.labelled(d[[i]])
  
  if (nResOpts < N_RESPONSE_OPTIONS_THRESHOLD) { 
    u <- unique(d[[i]])
    u <- sort(u)
    resOptActs <- as_character(toJSON(u))
  }
  
  if (nResOpts < N_RESPONSE_OPTIONS_THRESHOLD && stataLabs) {
    resOpts <- attr(d[[i]], "labels")
    resOptVals <- as_character(toJSON(resOpts))
    resOptLabs <- as_character(toJSON(names(resOpts)))
  }
  
  vl <- attr(d[[i]], "label")
  if (is.null(vl)) {
    vl <- "UNKNOWN"
  }
  
  df <- add_row(
    df,
    variable_name = n[i], 
    variable_label = vl,
    variable_type = c2,
    n_response_options = nResOpts,
    response_option_actuals = resOptActs,
    has_any_stata_labels = stataLabs,
    response_option_values = resOptVals,
    response_option_labels = resOptLabs,
    n_missing = nMiss,
  )
}

write_json(df, "VARLIST.json")
# Keymux Dev Utils

## Dependencies

### Ubuntu
* libssl-dev
* libcurl4-openssl-dev

## Components

### directory-changed.js

The `directory-changed` utility is intended to provide a portable way to diff specific elements of your repository in order to generate a comment for a pull request / merge request.

#### Usage

    #!/bin/bash

    # Output a diff if changelog.txt has changed relative to my local master but don't error if not
    yarn directory-changed --startsWith=changelog.txt --diffAgainstReference=master --noChangeExitCode=0

#### Options

Each of these options can be provided optionally, else the default will be used.

name                  | Required  | Default                                   | Explanation
--------------------- | --------- | ----------------------------------------- | -----------------
startsWith            | no        | .changes                                  | Starting path to search for changes, usually a directory
noChangeMessage       | no        | No changes were found                     | The message to output if there are no modifications found
noChangeExitCode      | no        | -1                                        | The process exit code to use when no changes were found
gitDir                | no        | .git                                      | The location of the .git directory to use for diffing
diffAgainstReference  | no        | refs/remotes/origin/master                | The reference to diff against
diffFormatEngine      | no        | github                                    | The diff format engine

##### diffFormatEngine

This will be expanded to include more options later, but for now, it only supports bitbucket and github, for which the outputs are the same.

    ```diff
      existing line
    + added line
    - removed line
      existing line
    ```

#### Gotchas

##### Commit your changes before diffing

In order to properly execute the directory-changed script, you need to have already committed your changes.  Staged or unstaged changes are not compared.

### mochawesome-markdown.js

The `mochawesome-markdown` utility is intended to provide a portable way to convert mochawesome.json output into markdown format for easy digestion in a pull request comment.

#### Usage

    #!/bin/bash

    # Setup shared variables
    REPORT_DIR=reports

    # Run mochawesome
    yarn mocha \
      --reporter mochawesome \
      --reporter-options reportDir="${REPORT_DIR}" \
      test/**

    # Convert to markdown
    yarn mochawesome-markdown \
      --mochawesome_json="${REPORT_DIR}/mochawesome.json" \
      | tee -a "${REPORT_DIR}/comment"

#### Options

name                  | Required  | Default                                   | Explanation
--------------------- | --------- | ----------------------------------------- | -----------------
mochawesome_json      | yes       |                                           | The full path to the mochawesome.json file
tableHeader           | no        | Passed,Failed,Skipped,Total,Percent       | The header row of the table
fields                | no        | passes,failures,pending,tests,passPercent | The arrangement of output fields
pre                   | no        | `"","*__","*","",""`                      | Pre-text per data cell, columns delimited by commas
post                  | no        | `"","__*","*","","%"`                     | Post-text per data cell, columns delimited by commas
header                | no        |                                           | Text to display above the table
footer                | no        |                                           | Text to display below the table

### nyc-markdown.js

The `nyc-markdown` utility is intended to provide a portable way to convert nyc/istanbul output into markdown format for easy digestion in a pull request comment.

#### Usage

    #!/bin/bash

    # Setup shared variables
    REPORT_DIR=reports

    yarn nyc \
      --reporter=lcov \
      --reporter=json-summary \
      --report-dir=${REPORT_DIR}/coverage \
      mocha test/**

    yarn nyc-markdown \
      --coverage_filename "${REPORT_DIR}/coverage/coverage-summary.json" \
      | tee -a "${REPORT_DIR}/comment"

#### Options

name                  | Required  | Default                                   | Explanation
--------------------- | --------- | ----------------------------------------- | -----------------
coverage_filename     | yes       |                                           | The full path to the coverage-summary.json file
tableHeader           | no        | Passed,Failed,Skipped,Total,Percent       | The header row of the table`*`
pre                   | no        | `"","*__","*","",""`                      | Pre-text per data cell, columns delimited by commas
post                  | no        | `"","__*","*","","%"`                     | Post-text per data cell, columns delimited by commas
header                | no        |                                           | Text to display above the table
footer                | no        |                                           | Text to display below the table

`*` doesn't affect child rows currently, so it's not particularly useful unless you just want different names.

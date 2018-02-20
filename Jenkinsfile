pipeline {
  agent any

  stages {
    stage("build") {
      parallel (
        "install": {
          sh "/bin/bash -c '. ~/.bash_profile; env; yarn install'"
          sh "rm -rf reports"
          sh "mkdir -p reports"
        }
      )
    }
    stage("test") {
      steps {
        parallel (
          "test:unit": { sh "/bin/bash -c '. ~/.bash_profile; yarn test:unit'" },
          "test:integration": { sh "/bin/bash -c '. ~/.bash_profile; yarn test:integration'" },
          "test:changelog": { sh "/bin/bash -c '. ~/.bash_profile; yarn test:changelog'" },
          "test:coverage": { sh "/bin/bash -c '. ~/.bash_profile; yarn test:coverage'" }
        )
      }
    }
    stage("test:summary") {
      steps {
        parallel (
          "test:summary": { sh "/bin/bash -c '. ~/.bash_profile; yarn test:summary'" },
          "test:unit:metrics": {
            publishHTML([
              allowMissing: false,
              alwaysLinkToLastBuild: false,
              keepAll: true,
              reportDir: 'reports/unit',
              reportFiles: 'mochawesome.html',
              reportName: 'Unit Testing Metrics',
              reportTitles: 'Unit Testing Metrics'
            ])
          },
          "test::coverage:metrics": {
            publishHTML([
              allowMissing: false,
              alwaysLinkToLastBuild: false,
              keepAll: true,
              reportDir: 'reports/unit/coverage/lcov-report',
              reportFiles: 'index.html',
              reportName: 'Unit Testing Coverage Metrics',
              reportTitles: 'Unit Testing Coverage Metrics'
            ])
          }
        )
      }
    }
  }
}

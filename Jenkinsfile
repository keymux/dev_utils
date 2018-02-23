pipeline {
  agent any

  stages {
    stage("build") {
      steps {
        parallel (
          "clean": { sh "/bin/bash -c '. ~/.bash_profile; yarn clean'" },
          "env": { sh "/bin/bash -c 'env'" },
          "install": { sh "/bin/bash -c '. ~/.bash_profile; yarn install'" }
        )
      }
    }
    stage("test") {
      steps {
        parallel (
          "test:changelog": { sh "/bin/bash -c '. ~/.bash_profile; yarn test:changelog'" },
          "test:coverage": { sh "/bin/bash -c '. ~/.bash_profile; yarn test:coverage'" },
          "test:integration": { sh "/bin/bash -c '. ~/.bash_profile; yarn test:integration'" },
          "test:lint": { sh "/bin/bash -c '. ~/.bash_profile; yarn test:lint'" },
          "test:unit": { sh "/bin/bash -c '. ~/.bash_profile; yarn test:unit'" }
        )
      }
    }
    stage("metrics") {
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
    stage("resolve") {
      steps {
        parallel (
          "test:changelog": { sh "/bin/bash -c '. ~/.bash_profile; yarn test:resolve changelog'" },
          "test:coverage": { sh "/bin/bash -c '. ~/.bash_profile; yarn test:resolve coverage'" },
          "test:integration": { sh "/bin/bash -c '. ~/.bash_profile; yarn test:resolve integration'" },
          "test:lint": { sh "/bin/bash -c '. ~/.bash_profile; yarn test:resolve lint'" },
          "test:unit": { sh "/bin/bash -c '. ~/.bash_profile; yarn test:resolve unit'" }
        )
      }
    }
  }
}

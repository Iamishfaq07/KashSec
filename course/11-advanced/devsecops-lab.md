# DevSecOps Lab

Integrate security into the development lifecycle.

## Lab focus
Use a simple CI/CD setup (GitHub Actions, GitLab CI, or local scripts) with security tools.

## Tasks
1. Add SAST scanning (e.g., Semgrep or CodeQL) to a pipeline
2. Run dependency scanning (e.g., Trivy or Dependabot)
3. Implement secret scanning
4. Add a security gate that fails the build on critical findings

## Challenge
Build a small pipeline that scans code, dependencies, and secrets, and blocks merges on high-severity issues.

**Next up →** [Threat Modeling](#/lesson/11-advanced/threat-modeling-lab)
# Containers & Kubernetes Lab

Container escapes and Kubernetes misconfigurations are an increasingly common finding in real-world assessments as more infrastructure moves to containerized deployments. This lab builds hands-on intuition for the most common issues, safely, on your own machine.

## Lab environment

You'll need **Docker** installed (on your Kali VM, your host machine, or via Docker Desktop). No Kubernetes cluster is required for the first three tasks — a local `kind` (Kubernetes in Docker) or `minikube` cluster is only needed for Task 3, and both are free and quick to spin up if you want to go further.

## Tasks

1. **Enumerate from inside a container.** Run a basic vulnerable container (many exist on Docker Hub explicitly for training — search "vulnerable container lab" or use a plain `ubuntu` image with intentionally weak permissions you configure yourself) and, once inside, check what you can see: `whoami`, `id`, environment variables (`env`), and mounted volumes (`mount`). Note how much of the host's information leaks into the container by default.
2. **Check for Docker socket exposure** — a classic, extremely dangerous misconfiguration. If a container has `/var/run/docker.sock` mounted inside it, anything running in that container can control the *entire host's Docker daemon*, effectively escaping the container. Test this safely in your own lab:
   ```bash
   docker run -it -v /var/run/docker.sock:/var/run/docker.sock docker:cli sh
   # From inside, list host containers — proof you've broken out of your own container's boundary:
   docker ps
   ```
   If that succeeds, you've just demonstrated a full container-to-host escape.
3. **Explore Kubernetes RBAC (optional, if you set up a local cluster).** Spin up a `kind` cluster, create a service account with overly broad permissions, and use `kubectl auth can-i --list --as=system:serviceaccount:default:your-sa` to see exactly what that identity can do — this mirrors exactly how real Kubernetes privilege escalation assessments start.
4. **Hunt for secrets in plain sight.** Run `docker inspect <container>` on a running container and check the `Env` section, and separately check any `ConfigMap`/`Secret` objects if using Kubernetes — misconfigured environments regularly leak API keys and database credentials this way, in both container and Kubernetes environments.

:::warn Only ever test containers/clusters you built or own
Everything above must be run against your own local Docker/Kubernetes setup — never against infrastructure you don't have explicit authorization to test, exactly as with every other lab in this course.
:::

:::challenge Document a full escalation path
Pick one issue you found (Docker socket exposure is the most dramatic and recommended starting point) and write it up: what the misconfiguration was, exactly how you exploited it step by step, what access it granted, and the specific fix (e.g., "never mount the Docker socket into untrusted containers; use rootless Docker or a dedicated sidecar if socket access is genuinely required").
:::

## Key takeaway

Container and Kubernetes security failures are almost always **configuration failures**, not flaws in Docker or Kubernetes themselves — mounted sockets, overly broad RBAC roles, and secrets stored as plain environment variables are the recurring root causes behind the vast majority of real container escapes reported in the wild.

**Next up →** [DevSecOps Lab](#/lesson/11-advanced/devsecops-lab)

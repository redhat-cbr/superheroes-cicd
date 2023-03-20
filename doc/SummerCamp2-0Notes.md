# Notes from Summer Camp 2.0 work

## Things to sort out

### Internal Registry Credentials

The internal SA named **serviceaccount** has sufficient privileges to push to and pull from the internal registry.  However the 2 secrets that get created automatically are not in the correct format for the buildah PUSH:

* builder-dockercfg-chq6f
* builder-token-wrc6g

***TODO: Need to work out how to copy or modify the secrets to work with buildah.***
Essentially, the builder-dockercfg... secret would be ok if we could replace the _Data: .dockerconfig_ with _Data: config.json_

***COMPLETED***
Batch job tekton/job-transform-builder-secret.yaml does the transform

### Why is SonarQube asking for a username and password?  

Steven mentioned this is because sonarqube needs an initial login to create the admin user password.
It might be possible to just replace a htpasswd secret if that is that is how it works.

***TODO: investigate***

### How to update the rox-token secret with the API token from ACS?

Manually generate an API token from **Platform Configuration > Integrations**

Should be able to do this via the API but doesn't seem to be working too well.

Update rox_token secret with the new token.

***TODO: This needs to be automated***

***COMPLETED***
Batch job tekton/job-generate-rox-api-token.yaml creates the ACS API token and creates the secret for the acs-scan tasks

### Why is the image scan failing:

STEP-ROX-IMAGE-SCAN

central.acs-instance.svc:443
eyJhbGciOiJSUzI1NiIsImtpZCI6Imp3dGswIiwidHlwIjoiSldUIn0.eyJhdWQiOlsiaHR0cHM6Ly9zdGFja3JveC5pby9qd3Qtc291cmNlcyNhcGktdG9rZW5zIl0sImV4cCI6MTcwOTc4NzczMCwiaWF0IjoxNjc4MjUxNzMwLCJpc3MiOiJodHRwczovL3N0YWNrcm94LmlvL2p3dCIsImp0aSI6ImEwOTRhM2MwLWU5N2QtNDkwNS04ODQwLTFkYjljOGEyODI5ZSIsIm5hbWUiOiJjaS10b2tlbiIsInJvbGVzIjpbIkNvbnRpbnVvdXMgSW50ZWdyYXRpb24iXX0.B2HiYBEl0W-VaVwF5GFxZ5m6Q8M0XyEZ-8TZ5VkB6GqbHdDvn37nln9yLg-F9wL8ukbGyHBdlTImicV0BfimERnA7GpgVKsbnFqgzUyZV856UaaP-G9Sdg1sYJcZFB7XmmWmGqY_PUsW1lZdYYTjnwzRVaLlzQFL9ik9HgYorWpwvp89pj_FP_Q-F2puGcycIjPkYjkCrECNdiZcy4in4f9u2Nc4uE2oBo7z3M_hmRtHZL5Syelue1kvlqRiZZ9GPL0Hy3p9p6YubU2uxdnKNbIqlgIYxuQr-J_qC5BfEHtVujacEluOkLM0WmxGYdN__eb4IseEc9_JBNyOqVn1o9W5gte3txEElnE8_rD0xnX1Vc5_IcZ82UzI5VJTIinpw45drYddqWQlO-FLK9nBg1OUjQ3nhdcynK836586PwiK4DwMX-f2fsbTms9Ai2b63j-Qjmw8JZGZf0wBNoDCJfIpdqzZt_gnmhAEyywEj8DbPkfGiC9C1zod0m5Esrz2bzy7wdp_--BvcGSIxJn0h_dlZH4xMnxkGqefhjJyFTgMlwJ9siuxbaTZ2Fa4tK4LLYBqsixwqiCNhdqSzps1jt4Nb2LWm5zM0vKb5XPvmDgdjocxJoYVymkH1QPscD-oKGevmhv43mX3z4_Wb26jAMV1wz-pH2JLS-o1Ox36Lcs
Getting roxctl
chmod: cannot access './roxctl': No such file or directory
/tekton/scripts/script-0-94znm: line 12: ./roxctl: No such file or directory

Issue is a stray newline in the secret-acs-endpoint.yaml base64 encoded string.

**Need to be very careful with newlines on these tokens**

***TODO: automate the creation of the rox API token secret in the build project***

***COMPLETED***
Batch job tekton/job-generate-rox-api-token.yaml creates the ACS API token and creates the secret for the acs-scan tasks

### Why is the image scan failing with a 401

Rock: The problem is that you have everything defined in the one namespace - 'acs-instance'
      You need to split central and secured-cluster-services into their own namespaces
      he problem occurs because both central and secured-cluster-services create their own service called 'scanner'
      the 'scanner' that secured-cluster-services creates is targeted towards the internal registry
      Deploying everything into the one namespace creates conflicts with both deployments called 'scanner'
      Splitting out the namespaces solves this

./roxctl image scan --insecure-skip-tls-verify" -e "$ROX_CENTRAL_ENDPOINT" --image "${NEWIMAGE}"

**Still getting a 401**

Rock: I think there are still issues with this configuration. Try forcing it manually?
      https://www.stb.id.au/blog/internal-registry-acs

**Still getting a 401**

ROX_CENTRAL_ENDPOINT=central-acs-central.apps.cluster-zsnww.zsnww.sandbox830.opentlc.com
ROX_API_TOKEN=eyJhbGciOiJSUzI1NiIsImtpZCI6Imp3dGswIiwidHlwIjoiSldUIn0.eyJhdWQiOlsiaHR0cHM6Ly9zdGFja3JveC5pby9qd3Qtc291cmNlcyNhcGktdG9rZW5zIl0sImV4cCI6MTcwOTg2OTA3NywiaWF0IjoxNjc4MzMzMDc3LCJpc3MiOiJodHRwczovL3N0YWNrcm94LmlvL2p3dCIsImp0aSI6ImIzOWY4MmIwLTNmYjItNGQyNS05YjZhLTQwOWE5YTIxMmQwYyIsIm5hbWUiOiJST1hfQVBJX1RPS0VOIiwicm9sZXMiOlsiQWRtaW4iXX0.XkSJgh5nau_a2ymhv1874sSJYGBKGAotcAEYhm8Bwph0Rdv_hhjTnLEeqz9C_mUuDRsnm-O6SHC7BaiUXbelTeCD0xFlpuEce4VAybJuxLXTmYFk77DwP4oz9bDZNZCR3Yl-vQF3NFKcm17fvjg0RD3gKoQs6QlTzwRzKXvIE83dg3uqWYR2IY-WdlsYPa8aF6GlXUAyaV2pFvrpFFIreWIYLoi37IaOI7zr-NlXulE1rXpkz88sNBQUwgPAliva3IoLNVuokXijzyLU6VKX3v4DvGJsyQhBG5vKmVdpTDP9d7Hwt_tzk5dz8RV_HGRhWmoq2Tgq-H91MCh9vHm0Ta0QLoomiWYp5EsDfZp48G5qmUyQQXkqzW1iDnaXlFlQa_RidGhOiF1seauCAn48zGK25ycMkEJYGMPoZL8oyCqt9C2KTfFsJOKc7VIaumWVuK5PeO3uAt2etX5MNId_L3xXPa4HnlDPKMl1BKXS_RDs-KiZXT32jtGvt1eZPsbwtJ7sf1El6RLMi17JcEgl_ci3Etru05x5C5NLLZXIH0FPd0ZgLi1q6_nc3Il_zegceg1_D2_jjNuG66-4tQPENC7OXOVtxKpKjNYGOMJXeOL_hUlJITfvEpqxqRjurhASvV6nDksAhJ5Ly2nGA2fvRwuvqd1f36EIfkZ_YSyjuEc

curl -s -k -L -H "Authorization: Bearer $ROX_API_TOKEN"  "https://$ROX_CENTRAL_ENDPOINT/api/cli/download/roxctl-linux" --output ./roxctl
chmod + x ./roxctl
IMAGE=image-registry.openshift-image-registry.svc:5000/superheroes-build/event-statistics:20230309-012234-2218ee
./roxctl image scan --insecure-skip-tls-verify -e "$ROX_CENTRAL_ENDPOINT" --image "${IMAGE}"

From the central pod:
pkg/images/enricher: 2023/03/09 03:58:01.784055 enricher_impl.go:264: Info: Getting metadata for image image-registry.openshift-image-registry.svc:5000/superheroes-build/event-statistics:20230309-012234-2218ee

Found the following on chat:
Well, looks like roxctl does not work when specifying the internal registry name 🙁
https://chat.google.com/room/AAAA9gJI6o4/R_HiLQP5_Z0

**Another attempt**

My new install on March 14 was in the state where both the ACS Central and SecuredCluster instances were created but Central did not know about the SecuredCluster.
After:
1. Manually generating an ACS API token
2. Using the internal registry internal IP address as the endpoint
3. Manually creating an integration to the internal registry internal URL in ACS
4. Connecting to a Node, setting the vars and running the commands from the acs-can-image tekton task

      ROX_CENTRAL_ENDPOINT=172.30.95.144:443
      ROX_API_TOKEN=eyJhbGciOiJSUzI1NiI....
      curl -v -s -k -L -H "Authorization: Bearer $ROX_API_TOKEN" "https://$ROX_CENTRAL_ENDPOINT/api/cli/download/roxctl-linux" --output /tmp/roxctl
      chmod +x /tmp/roxctl 
      NEWIMAGE=image-registry.openshift-image-registry.svc:5000/superheroes-build/ui-super-heroes:20230314-011604-2218ee
      /tmp/roxctl scan --insecure-skip-tls-verify  -e "$ROX_CENTRAL_ENDPOINT" --image "${NEWIMAGE}"
      
It actually worked!

Need to work out why the credentials do not work when run in the pipeline. 
Managed to get it to work by deleting the generated credential integrations in ACS for the local registry and recreated.

***TODO***

Still not sure what is going on here.  need to retest and probably build a batch python job to either"
- Delete the generated credential integrations in ACS for the local registry and recreate
- Update the existing credential integrations in ACS for the local registry


### Separate namespaces issues

The job that runs in acs-central and generates the init-bundle can not apply it to the acs-instance namesapce.  Maybe the job should actually run in acs-instance?
        curl -s -k -L -H "Authorization: Bearer $ROX_API_TOKEN" \
          "https://$ROX_CENTRAL_ENDPOINT/api/cli/download/roxctl-linux" \
          --output ./roxctl  > /dev/null; echo "Getting roxctl"

The SecuredCluster instance does not get created with the Central endpoint name.  Why not?

***TODO***

I think this is ok now, I was missing the port on the Central endpoint.
Need to re-test from a clean build.

## Tasks not yet started

### Modify CD pipelines to use internal registry

### Bypass Jira integration

### Test CD pipelines

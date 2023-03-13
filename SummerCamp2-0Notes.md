Things to sort out

1. Why is SonarQube asking for a username and password?  



Could this be because I am using the internal URL:


Not sure that makes sense though.

Talk to Steve?

2. How to update the rox-token secret with the API token from ACS?

Generate an API token from Platform Configuration > Integrations

eyJhbGciOiJSUzI1NiIsImtpZCI6Imp3dGswIiwidHlwIjoiSldUIn0.eyJhdWQiOlsiaHR0cHM6Ly9zdGFja3JveC5pby9qd3Qtc291cmNlcyNhcGktdG9rZW5zIl0sImV4cCI6MTcwOTc4NzczMCwiaWF0IjoxNjc4MjUxNzMwLCJpc3MiOiJodHRwczovL3N0YWNrcm94LmlvL2p3dCIsImp0aSI6ImEwOTRhM2MwLWU5N2QtNDkwNS04ODQwLTFkYjljOGEyODI5ZSIsIm5hbWUiOiJjaS10b2tlbiIsInJvbGVzIjpbIkNvbnRpbnVvdXMgSW50ZWdyYXRpb24iXX0.B2HiYBEl0W-VaVwF5GFxZ5m6Q8M0XyEZ-8TZ5VkB6GqbHdDvn37nln9yLg-F9wL8ukbGyHBdlTImicV0BfimERnA7GpgVKsbnFqgzUyZV856UaaP-G9Sdg1sYJcZFB7XmmWmGqY_PUsW1lZdYYTjnwzRVaLlzQFL9ik9HgYorWpwvp89pj_FP_Q-F2puGcycIjPkYjkCrECNdiZcy4in4f9u2Nc4uE2oBo7z3M_hmRtHZL5Syelue1kvlqRiZZ9GPL0Hy3p9p6YubU2uxdnKNbIqlgIYxuQr-J_qC5BfEHtVujacEluOkLM0WmxGYdN__eb4IseEc9_JBNyOqVn1o9W5gte3txEElnE8_rD0xnX1Vc5_IcZ82UzI5VJTIinpw45drYddqWQlO-FLK9nBg1OUjQ3nhdcynK836586PwiK4DwMX-f2fsbTms9Ai2b63j-Qjmw8JZGZf0wBNoDCJfIpdqzZt_gnmhAEyywEj8DbPkfGiC9C1zod0m5Esrz2bzy7wdp_--BvcGSIxJn0h_dlZH4xMnxkGqefhjJyFTgMlwJ9siuxbaTZ2Fa4tK4LLYBqsixwqiCNhdqSzps1jt4Nb2LWm5zM0vKb5XPvmDgdjocxJoYVymkH1QPscD-oKGevmhv43mX3z4_Wb26jAMV1wz-pH2JLS-o1Ox36Lcs

Should be able to do this via the API but doesn't seem to be working too well.

Update rox_token secret with the new token.

3. Why is the image scan failing:

STEP-ROX-IMAGE-SCAN

central.acs-instance.svc:443
eyJhbGciOiJSUzI1NiIsImtpZCI6Imp3dGswIiwidHlwIjoiSldUIn0.eyJhdWQiOlsiaHR0cHM6Ly9zdGFja3JveC5pby9qd3Qtc291cmNlcyNhcGktdG9rZW5zIl0sImV4cCI6MTcwOTc4NzczMCwiaWF0IjoxNjc4MjUxNzMwLCJpc3MiOiJodHRwczovL3N0YWNrcm94LmlvL2p3dCIsImp0aSI6ImEwOTRhM2MwLWU5N2QtNDkwNS04ODQwLTFkYjljOGEyODI5ZSIsIm5hbWUiOiJjaS10b2tlbiIsInJvbGVzIjpbIkNvbnRpbnVvdXMgSW50ZWdyYXRpb24iXX0.B2HiYBEl0W-VaVwF5GFxZ5m6Q8M0XyEZ-8TZ5VkB6GqbHdDvn37nln9yLg-F9wL8ukbGyHBdlTImicV0BfimERnA7GpgVKsbnFqgzUyZV856UaaP-G9Sdg1sYJcZFB7XmmWmGqY_PUsW1lZdYYTjnwzRVaLlzQFL9ik9HgYorWpwvp89pj_FP_Q-F2puGcycIjPkYjkCrECNdiZcy4in4f9u2Nc4uE2oBo7z3M_hmRtHZL5Syelue1kvlqRiZZ9GPL0Hy3p9p6YubU2uxdnKNbIqlgIYxuQr-J_qC5BfEHtVujacEluOkLM0WmxGYdN__eb4IseEc9_JBNyOqVn1o9W5gte3txEElnE8_rD0xnX1Vc5_IcZ82UzI5VJTIinpw45drYddqWQlO-FLK9nBg1OUjQ3nhdcynK836586PwiK4DwMX-f2fsbTms9Ai2b63j-Qjmw8JZGZf0wBNoDCJfIpdqzZt_gnmhAEyywEj8DbPkfGiC9C1zod0m5Esrz2bzy7wdp_--BvcGSIxJn0h_dlZH4xMnxkGqefhjJyFTgMlwJ9siuxbaTZ2Fa4tK4LLYBqsixwqiCNhdqSzps1jt4Nb2LWm5zM0vKb5XPvmDgdjocxJoYVymkH1QPscD-oKGevmhv43mX3z4_Wb26jAMV1wz-pH2JLS-o1Ox36Lcs
Getting roxctl
chmod: cannot access './roxctl': No such file or directory
/tekton/scripts/script-0-94znm: line 12: ./roxctl: No such file or directory

Issue is a stray newline in the secret-acs-endpoint.yaml base64 encoded string.

4. Why is the image scan failing with a 401

Rock: The problem is that you have everything defined in the one namespace - 'acs-instance'
      You need to split central and secured-cluster-services into their own namespaces
      he problem occurs because both central and secured-cluster-services create their own service called 'scanner'
      the 'scanner' that secured-cluster-services creates is targeted towards the internal registry
      Deploying everything into the one namespace creates conflicts with both deployments called 'scanner'
      Splitting out the namespaces solves this

./roxctl image scan --insecure-skip-tls-verify" -e "$ROX_CENTRAL_ENDPOINT" --image "${NEWIMAGE}"

4 (ii)  Still getting a 401

Rock: I think there are still issues with this configuration. Try forcing it manually?
      https://www.stb.id.au/blog/internal-registry-acs

4 (iii) Still getting a 401

ROX_CENTRAL_ENDPOINT=central-acs-central.apps.cluster-zsnww.zsnww.sandbox830.opentlc.com
ROX_API_TOKEN=ROX_API_TOKEN=eyJhbGciOiJSUzI1NiIsImtpZCI6Imp3dGswIiwidHlwIjoiSldUIn0.eyJhdWQiOlsiaHR0cHM6Ly9zdGFja3JveC5pby9qd3Qtc291cmNlcyNhcGktdG9rZW5zIl0sImV4cCI6MTcwOTg2OTA3NywaWF0IjoxNjc4MzMzMDc3LCJpc3MiOiJodHRwczovL3N0YWNrcm94LmlvL2p3dCIsImp0aSI6ImIzOWY4MmIwLTNmYjItNGQyNS05YjZhLTQwOWE5YTIxMmQwYyIsIm5hbWUiOiJST1hfQVBJX1RPS0VOIiwicm9sZXMiOlsiQWRta4iXX0.XkSJgh5nau_a2ymhv1874sSJYGBKGAotcAEYhm8Bwph0Rdv_hhjTnLEeqz9C_mUuDRsnm-O6SHC7BaiUXbelTeCD0xFlpuEce4VAybJuxLXTmYFk77DwP4oz9bDZNZCR3Yl-vQF3NFKcm17fvjg0RD3gKoQs6QlTzwRzKXvE83dg3uqWYR2IY-WdlsYPa8aF6GlXUAyaV2pFvrpFFIreWIYLoi37IaOI7zr-NlXulE1rXpkz88sNBQUwgPAliva3IoLNVuokXijzyLU6VKX3v4DvGJsyQhBG5vKmVdpTDP9d7Hwt_tzk5dz8RV_HGRhWmoq2Tgq-H91MCh9vHm0T0QLoomiWYp5EsDfZp48G5qmUyQQXkqzW1iDnaXlFlQa_RidGhOiF1seauCAn48zGK25ycMkEJYGMPoZL8oyCqt9C2KTfFsJOKc7VIaumWVuK5PeO3uAt2etX5MNId_L3xXPa4HnlDPKMl1BKXS_RDs-KiZXT32jtGvt1eZPsbwtJ7f1El6RLMi17JcEgl_ci3Etru05x5C5NLLZXIH0FPd0ZgLi1q6_nc3Il_zegceg1_D2_jjNuG66-4tQPENC7OXOVtxKpKjNYGOMJXeOL_hUlJITfvEpqxqRjurhASvV6nDksAhJ5Ly2nGA2fvRwuvqd1f36EIfkZ_YSyjuEc
curl -s -k -L -H "Authorization: Bearer $ROX_API_TOKEN"  "https://$ROX_CENTRAL_ENDPOINT/api/cli/download/roxctl-linux" --output ./roxctl

5. Separate namespaces issues

5.1 The job that runs in acs-central and generates the init-bundle can not apply it to the acs-instance namesapce.  Maybe the job should actually run in acs-instance?

5.2 The SecuredCluster instance does not get created with the Central endpoint name.  Why not?

6.
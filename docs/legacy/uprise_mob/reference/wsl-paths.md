 The WSL root for the UPRISE project is:

  /mnt/d/uprise_mob

  Breakdown:
  - /mnt/d/ = Windows D: drive mounted in WSL
  - uprise_mob = Project directory

  Key paths in WSL:
  - Project root: /mnt/d/uprise_mob
  - Docs root: /mnt/d/uprise_mob/docs/
  - Specs: /mnt/d/uprise_mob/docs/specs/
  - Architecture: /mnt/d/uprise_mob/docs/reference/architecture/

  So when you start Claude in WSL, you'll run:
  cd /mnt/d/uprise_mob

  Then you'll have access to all the organized documentation in docs/. (Note: CCPM and .claude paths are no longer part of the strategy.) 📁

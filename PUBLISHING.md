# Vaadin Directory Publishing Guide

This document outlines the steps to publish **HighlightJS & Monaco Vaadin Wrapper** to the Vaadin Directory.

## ✅ Prerequisites Checklist

- [x] Open source license (MIT) - declared in `pom.xml` and `LICENSE` file
- [x] Public GitHub repository - https://github.com/ka0un/vaadin-highlight-js
- [x] Release version - set to `1.0.0` (no `-SNAPSHOT`)
- [x] Vaadin Directory description - `vaadin-directory-description.md`
- [x] Badge in README.md
- [x] Project metadata in `pom.xml`
- [x] Maven Central setup configured

## 📋 Step-by-Step Publishing

### 1. Prepare Local Maven Settings

Create/update `~/.m2/settings.xml`:

```xml
<settings>
  <servers>
    <server>
      <id>ossrh</id>
      <username>your-sonatype-username</username>
      <password>your-sonatype-password</password>
    </server>
  </servers>
  
  <profiles>
    <profile>
      <id>gpg</id>
      <properties>
        <gpg.executable>gpg</gpg.executable>
        <gpg.passphrase>your-gpg-passphrase</gpg.passphrase>
      </properties>
    </profile>
  </profiles>
  
  <activeProfiles>
    <activeProfile>gpg</activeProfile>
  </activeProfiles>
</settings>
```

### 2. Verify GPG Key

```bash
gpg --list-keys
# If you do not have a secret key yet, create or import one before deploying:
#   gpg --full-generate-key
# or import an existing secret key backup:
#   gpg --import /path/to/private-key.asc
gpg --list-secret-keys
```

**If Maven fails with `No secret key`**, that means the release profile can find `gpg`, but there is no signing key available in your local keyring yet.

Run the following once to create a usable signing key if you don't already have one:

```bash
gpg --full-generate-key
gpg --list-secret-keys --keyid-format=long
```

Then update your `~/.m2/settings.xml` if you need to provide a passphrase via Maven, and retry `mvn clean deploy -Prelease`.

### 3. Build and Test

```bash
mvn clean verify
```

### 4. Deploy to Maven Central

```bash
mvn clean deploy -Prelease
```

If Maven cannot find `gpg`, install it first (for example on macOS):

```bash
brew install gnupg
```

If deployment fails with `402 Payment Required`, your Sonatype account likely does not yet have permission for the `com.sundev.sunpaste` namespace, or the Central publishing flow has not been provisioned for your account.

In that case you have two paths:

1. **For Vaadin Directory submission only**: you can proceed with the GitHub repository, `README.md`, and `vaadin-directory-description.md`.
2. **For Maven Central publishing**: claim/provision the namespace in Sonatype Central and then retry `mvn clean deploy -Prelease`.

### 5. Release from Sonatype

Visit https://s01.oss.sonatype.org/ and:
- Find your staging repository
- Click "Close" then "Release"

### 6. Submit to Vaadin Directory

Visit: https://vaadin.com/directory/submit

Fill in:
- **Component Name**: HighlightJS & Monaco Vaadin Wrapper
- **Description**: (Use `vaadin-directory-description.md`)
- **Repository**: https://github.com/ka0un/vaadin-highlight-js
- **Component link / package**: use the GitHub repository URL if requested
- **Maven**: `com.sundev.sunpaste:highlightJS-vaadin-wrapper:1.0.0`
- **License**: MIT

## 📚 Key Files

- `pom.xml` - Maven configuration
- `LICENSE` - MIT license
- `README.md` - Installation guide
- `vaadin-directory-description.md` - Directory description
- `HighlightJs.java` - Component class

---

Execute `mvn clean deploy -Prelease` when ready to publish to Maven Central.


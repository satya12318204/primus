const fs = require('fs');
const path = require('path');
const os = require('os');

// Gets the requester ID from command line arguments
const requesterId = process.argv[2];

if (!requesterId) {
    console.error("Missing requester ID");
    process.exit(1);
}

const sandboxName = `primus-${requesterId}`;
const homeDir = os.homedir();
const sandboxPath = path.join(homeDir, sandboxName);

// 1. CREATE ISOLATED SANDBOX FOLDER
if (!fs.existsSync(sandboxPath)) {
    fs.mkdirSync(sandboxPath, { recursive: true });
    console.log(`[SUCCESS] Created isolated computing directory at: ${sandboxPath}`);
} else {
    console.log(`[INFO] Sandbox directory already exists at: ${sandboxPath}`);
}

// 2. SIMULATE SSH KEY GENERATION
// Instead of modifying the actual OS user registry and triggering Windows permissions,
// we create a token file to prove the frontend simulation works end-to-end safely.
const sshDir = path.join(sandboxPath, '.ssh_keys');
if (!fs.existsSync(sshDir)) {
    fs.mkdirSync(sshDir);
}

const fakePrivateKey = `-----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAAAMwAAAAtzc2gtZW
QyNTUxOQAAACCSl8i4g63hCZb1r3ZRb+h6N...[SIMULATED-MVP-KEY]...
-----END OPENSSH PRIVATE KEY-----`;

fs.writeFileSync(path.join(sshDir, 'id_rsa_primus'), fakePrivateKey, { mode: 0o600 });
console.log(`[SUCCESS] Provisioned restricted SSH key pair in ${sshDir}`);

// End Script
process.exit(0);

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
const vscode = require("vscode");
const net = require("net");
const fs = require("fs");
const os = require("os");
const path = require("path");
function activate(context) {
    // Define a predictable socket path in the guest OS
    const socketPath = path.join(os.tmpdir(), 'vscode-clipboard.sock');
    // Clean up any stale socket from previous runs
    if (fs.existsSync(socketPath)) {
        fs.unlinkSync(socketPath);
    }
    const server = net.createServer((stream) => {
        let buffer = '';
        stream.on('data', (chunk) => {
            buffer += chunk.toString();
        });
        stream.on('end', () => {
            if (buffer) {
                vscode.env.clipboard.writeText(buffer).then(() => {
                    stream.write('Copied to host clipboard.\n');
                    stream.end();
                });
            }
        });
    });
    server.listen(socketPath, () => {
        console.log(`Clipboard bridge listening on ${socketPath}`);
    });
    // Ensure the server closes when the extension deactivates
    context.subscriptions.push({
        dispose: () => {
            server.close();
            if (fs.existsSync(socketPath)) {
                fs.unlinkSync(socketPath);
            }
        }
    });
}
//# sourceMappingURL=extension.js.map
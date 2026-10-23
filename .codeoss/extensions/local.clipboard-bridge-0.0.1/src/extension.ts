import * as vscode from 'vscode';
import * as net from 'net';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
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
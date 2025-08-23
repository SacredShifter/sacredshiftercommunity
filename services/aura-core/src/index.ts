import { exec } from 'child_process';
import { promisify } from 'util';
import * as path from 'path';
import express from 'express';

const execAsync = promisify(exec);

const INFRA_DIR = path.resolve(__dirname, '../../../infra');
const PULUMI_BIN = path.resolve(process.env.HOME || '~', '.pulumi/bin/pulumi');

// --- Task Definitions ---

interface Task {
    name: string;
    description: string;
    run: () => Promise<void>;
}

async function runPulumiCommand(command: string, stack: string, secrets: Record<string, string> = {}) {
    console.log(`\nRunning 'pulumi ${command}' on stack '${stack}'...`);
    try {
        const { stdout, stderr } = await execAsync(`${PULUMI_BIN} ${command}`, {
            cwd: INFRA_DIR,
            env: {
                ...process.env,
                ...secrets,
                PULUMI_CONFIG_PASSPHRASE: 'sacredshifter',
            },
        });

        if (stderr && !stderr.includes("no configuration value")) {
            console.error(`[${stack}] stderr:`, stderr);
        }
        if (stdout) {
            console.log(`[${stack}] stdout:`, stdout);
        }
        console.log(`'pulumi ${command}' on stack '${stack}' completed successfully.`);
        return stdout.trim();
    } catch (error) {
        if (command.startsWith('config get')) {
            return '';
        }
        console.error(`Error running 'pulumi ${command}' on stack '${stack}':`, error);
        throw error;
    }
}

async function bootstrapInfraTask() {
    console.log("Running 'bootstrap_infra' task...");
    await runPulumiCommand('login --local', 'local');

    // Staging
    console.log("\n--- Bootstrapping Staging Environment ---");
    const stagingStack = 'staging';
    await runPulumiCommand(`stack select ${stagingStack}`, stagingStack);
    await runPulumiCommand(`config set domain staging.sacredshifter.app`, stagingStack);
    await runPulumiCommand(`config set supabaseUrl "https://staging-placeholder.supabase.co"`, stagingStack);
    await runPulumiCommand(`config set --secret supabaseAnonKey "staging-placeholder-key"`, stagingStack);
    await runPulumiCommand(`config set --path 'corsAllowlist[0]' "https://staging.sacredshifter.app"`, stagingStack);
    await runPulumiCommand('up --yes', stagingStack);

    // Production
    console.log("\n--- Bootstrapping Production Environment ---");
    const prodStack = 'prod';
    await runPulumiCommand(`stack select ${prodStack}`, prodStack);
    await runPulumiCommand(`config set domain sacredshifter.app`, prodStack);
    await runPulumiCommand(`config set supabaseUrl "https://prod-placeholder.supabase.co"`, prodStack);
    await runPulumiCommand(`config set --secret supabaseAnonKey "prod-placeholder-key"`, prodStack);
    await runPulumiCommand(`config set --path 'corsAllowlist[0]' "https://sacredshifter.app"`, prodStack);
    await runPulumiCommand('up --yes', prodStack);

    console.log("\nTask 'bootstrap_infra' completed.");
}

const tasks: Task[] = [
    {
        name: 'bootstrap_infra',
        description: 'Provisions the initial infrastructure for staging and production.',
        run: bootstrapInfraTask,
    },
];

// --- API Server ---

function createApiServer() {
    const app = express();
    app.use(express.json());

    app.get('/api/tasks', (req, res) => {
        res.json(tasks.map(t => ({ name: t.name, description: t.description })));
    });

    app.post('/api/tasks/:taskName/run', (req, res) => {
        const taskName = req.params.taskName;
        const task = tasks.find(t => t.name === taskName);

        if (!task) {
            return res.status(404).json({ error: `Task '${taskName}' not found.` });
        }

        console.log(`API request received to run task: ${taskName}`);
        // Run task in the background, don't wait for it to complete
        task.run().catch(error => {
            console.error(`Error running background task '${taskName}':`, error);
        });

        res.status(202).json({ message: `Task '${taskName}' started.` });
    });

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Aura Core API server listening on port ${PORT}`);
    });
}


// --- Main Entry Point ---

function printCliUsage() {
    console.log("Aura Core Task Runner (CLI)");
    console.log("Usage: npm run task <task_name>");
    console.log("\nAvailable tasks:");
    tasks.forEach(task => {
        console.log(`  ${task.name}: ${task.description}`);
    });
}

async function runCliTask() {
    const args = process.argv.slice(3); // node dist/index.js run <task_name>
    if (args.length === 0) {
        printCliUsage();
        process.exit(1);
    }

    const taskName = args[0];
    const task = tasks.find(t => t.name === taskName);

    if (!task) {
        console.error(`Error: Task '${taskName}' not found.`);
        printCliUsage();
        process.exit(1);
    }

    try {
        await task.run();
    } catch (error) {
        console.error(`Error running task '${taskName}':`, error);
        process.exit(1);
    }
}

function main() {
    const mode = process.argv[2] || 'server'; // default to server mode

    if (mode === 'server') {
        createApiServer();
    } else if (mode === 'run') {
        runCliTask();
    } else {
        console.error(`Unknown mode: ${mode}`);
        console.log("Available modes: 'server', 'run'");
        process.exit(1);
    }
}

main();

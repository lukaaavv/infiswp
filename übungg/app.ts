
import { assert } from "@std/assert";

const dataPath = "../2024-11-19/nmap-datenfiles";
const outputPath = "./output.txt";

function parseDate(dateStr: string): Date {
    const p = dateStr.split("_");
    return new Date(`${p[0]}:${p[1]}:${p[2]}+${p[3]}:${p[4]}`);
}

async function main() {
    const results: string[] = [];

    try {
        const dirEntries = await Deno.readDir(dataPath);

        for await (const dirEntry of dirEntries) {
            if (!dirEntry.isFile) {
                continue;
            }

            let date;
            try {
                date = parseDate(dirEntry.name);
            } catch (err) {
                assert(err instanceof Error);
                console.error("Error parsing date:", dirEntry.name, err.message);
                continue;
            }

            const filePath = `${dataPath}/${dirEntry.name}`;
            let host = undefined;
            let mac = undefined;

            for (const line of (await Deno.readTextFile(filePath)).split("\n")) {
                const cleanedLine = line.replace(/\r/g, "").trim();

                if (
                    cleanedLine === "" ||
                    cleanedLine.startsWith("Starting Nmap") ||
                    cleanedLine.startsWith("Nmap done") ||
                    cleanedLine.startsWith("Host is up")
                ) {
                    continue;
                }

                if (cleanedLine.startsWith("Nmap scan report for ")) {
                    host = cleanedLine.split(" ")[4];
                    continue;
                }

                if (cleanedLine.startsWith("MAC Address: ")) {
                    mac = cleanedLine.split(" ")[2].toLowerCase();
                    results.push(`${date.toISOString()};${host};${mac}`);
                }
            }
        }

        if (results.length > 0) {
            await Deno.writeTextFile(outputPath, results.join("\n"));
            console.log("Data written to", outputPath);
        } else {
            console.log("No valid data found to write.");
        }
    } catch (err) {
        console.error("Error reading the file:", err);
    }
}

await main();

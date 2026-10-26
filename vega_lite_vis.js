console.log("Vega-Lite is running!");

/* FIRST IDIOM */
vegaEmbed(
    "#first_idiom",
    "idioms/first_idiom.json",
    {
        actions: false /* Remove the menu options beside the idiom */
    }
).catch(console.error);

/* SECOND IDIOM */
vegaEmbed(
    "#second_idiom",
    "idioms/second_idiom.json",
    {
        actions: false
    }
).catch(console.error);

/* THIRD IDIOM */
// Calculate data for Marimekko chart
function prepMarimekko(data) {
    const ageGroups = [
        "Young adult aged 18-24",
        "Adult aged 25-54",
        "Mature adult aged 55+"
    ];
    
    const totals = {};

    data.forEach(row => {
        const age = row.Age_Group;
        const participants = Number(row.Estimated_Participants);

        totals[age] = (totals[age] || 0) + participants;
    });

    const grandTotal = Object.values(totals).reduce((sum, total) => sum + total, 0);

    let xStart = 0;
    const chartData = [];

    ageGroups.forEach(age => {
        const groupData = data.filter(
            row => row.Age_Group === age
        );
        
        const groupTotal = totals[age];
        const columnWidth = groupTotal / grandTotal;

        let yStart = 0;

        groupData.forEach(row => {
            const participants = 
            Number(row.Estimated_Participants);

            const segmentHeight = participants / groupTotal;

            chartData.push({
                ...row,
                Estimated_Participants: participants,
                Age_Group_Top6_Total: groupTotal,
                Share_Within_Selected_Sports: segmentHeight,
                x0: xStart,
                x1: xStart + columnWidth,
                xCenter: xStart + columnWidth / 2,
                y0: yStart,
                y1: yStart + segmentHeight,
                yCenter: yStart + segmentHeight / 2,
                label: `${row.Sport}\n${participants.toLocaleString()}`
            });

            yStart += segmentHeight;
        });

        xStart += columnWidth;
    });

    return chartData;
}

async function loadThirdIdiom() {
    try {
        const [csvResponse, jsonResponse] = await Promise.all([
            fetch("data/third_idiom.csv"),
            fetch("idioms/third_idiom.json")
        ]);

        if (!csvResponse.ok || !jsonResponse.ok) {
            throw new Error("Could not load data");
        }

        const csvText = await csvResponse.text();
        const spec = await jsonResponse.json();

        const lines = csvText.trim().split(/\r?\n/);
        const headers = lines[0].split(",");

        const data = lines.slice(1).map(line => {
            const values = line.split(",");
            const row = {};

            headers.forEach((header, index) => {
                row[header] = values[index];
            });

            return row;
        });

        spec.data.values = prepMarimekko(data);

        await vegaEmbed("#third_idiom", spec, {
            actions: false,
            renderer: "svg"
        });
    } catch (error) {
        console.error("Error loading Idiom 2:", error);
    }
}
loadThirdIdiom();

/* FOURTH IDIOM */
vegaEmbed(
    "#fourth_idiom",
    "idioms/fourth_idiom.json",
    {
        actions: false
    }
).catch(console.error);

/* FIFTH IDIOM */
vegaEmbed(
    "#fifth_idiom",
    "idioms/fifth_idiom.json",
    {
        actions: false
    }
).catch(console.error);

/* SIXTH IDIOM */
vegaEmbed(
    "#sixth_idiom",
    "idioms/sixth_idiom.json",
    {
        actions: false
    }
).catch(console.error);

/* SEVENTH IDIOM */
async function loadSeventhIdiom() {
    try {
        const chartContainer = document.querySelector("#seventh_idiom");
        const filter = document.querySelector("#age-group-filter");

        const response = await fetch("idioms/seventh_idiom.json");
        const spec = await response.json();
        
        const metrics = {
            Adult: {
                mean: 392, median: 150, participants: 776741, total: 304656616
            },
            Child: {
                mean: 237, median: 80, participants: 47127, total: 11166448
            }
        };
        
        function updateMetrics(group) {
            const selected = metrics[group];
            if (!selected) return;

            document.querySelector("#metric-mean").textContent = "$" + selected.mean.toLocaleString("en-AU");

            document.querySelector("#metric-median").textContent = "$" + selected.median.toLocaleString("en-AU");

            document.querySelector("#metric-participants").textContent = selected.participants.toLocaleString("en-AU");

            document.querySelector("#metric-total").textContent = "$" + (selected.total / 1000000).toFixed(1) + "m";

            const difference = Math.abs(metrics.Adult.mean - metrics.Child.mean);

            document.querySelector("#metric-insight").textContent = group === "Adult" ? `Adult mean expenditure is $${difference} higher than child mean expenditure nationally.` : `Child mean expenditure is $${difference} lower than adult mean expenditure nationally.`;
        }

        async function renderMap(group) {
            const chartSpec = structuredClone(spec);

            const calculation = chartSpec.layer[0].transform.find(
                item => item.calculate && item.calculate.includes("Mean Expenditure")
            );

            calculation.calculate = group === "Adult" ? "toNumber(datum['Mean Expenditure (Adult)'])" : "toNumber(datum['Mean Expenditure (Child)'])";

            await vegaEmbed("#seventh_idiom", chartSpec, {
                actions: false, renderer: "svg"
            });

            updateMetrics(group);
        }

        filter.addEventListener("change", () => {
            renderMap(filter.value);
        });

        await renderMap(filter.value)

    } catch (error) {
        console.error("Error loading Idiom 7: ", error);
    }
}
loadSeventhIdiom();

/* EIGHT IDIOM */
vegaEmbed(
    "#eight_idiom",
    "idioms/eight_idiom.json",
    {
        actions: false
    }
).catch(console.error);

/* NINTH IDIOM */
vegaEmbed(
    "#ninth_idiom",
    "idioms/ninth_idiom.json",
    {
        actions: false
    }
).catch(console.error);

/* TENTH IDIOM */
vegaEmbed(
    "#tenth_idiom",
    "idioms/tenth_idiom.json",
    {
        actions: false
    }
).catch(console.error);
function processFile() {
    const fileInput = document.getElementById("upload-file");
    const file = fileInput.files[0];

    if (!file) {
        alert("Please upload a CSV file.");
        return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        const content = e.target.result;
        const data = parseCSV(content);
        generateForecast(data);
    };
    reader.readAsText(file);
}

function parseCSV(content) {
    const rows = content.split("\n");
    const data = rows.slice(1).map(row => {
        const [date, volume] = row.split(",");
        return { date, volume: parseFloat(volume) };
    });
    return data;
}

function generateForecast(data) {
    const labels = data.map(item => item.date);
    const volumes = data.map(item => item.volume);

    const forecast = volumes.map((value, index) => {
        const growthRate = 1.05; // Assume 5% growth
        return index === 0 ? value : volumes[index - 1] * growthRate;
    });

    const ctx = document.getElementById("forecastChart").getContext("2d");
    new Chart(ctx, {
        type: "line",
        data: {
            labels,
            datasets: [
                {
                    label: "Actual Volumes",
                    data: volumes,
                    borderColor: "blue",
                    fill: false
                },
                {
                    label: "Forecasted Volumes",
                    data: forecast,
                    borderColor: "green",
                    borderDash: [5, 5],
                    fill: false
                }
            ]
        }
    });
}

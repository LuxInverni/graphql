export function drawCheckpointGraph(progress) {

    const width = 800;
    const height = 400;
    const padding = 80;

    const dates = Object.keys(progress);
    const values = Object.values(progress);

    const svg = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg"
    );

    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);

    const maxQuestion = Math.max(...values);

    // Width available for the bars
    const graphWidth = width - padding * 2;

    // Height available for the bars
    const graphHeight = height - padding * 2;

    const barWidth = graphWidth / dates.length * 0.7;
    const barSpacing = graphWidth / dates.length;


    // Y axis
    const yAxis = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "line"
    );

    yAxis.setAttribute("x1", padding);
    yAxis.setAttribute("y1", padding);
    yAxis.setAttribute("x2", padding);
    yAxis.setAttribute("y2", height - padding);
    yAxis.setAttribute("stroke", "black");

    svg.appendChild(yAxis);


    // X axis
    const xAxis = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "line"
    );

    xAxis.setAttribute("x1", padding);
    xAxis.setAttribute("y1", height - padding);
    xAxis.setAttribute("x2", width - padding);
    xAxis.setAttribute("y2", height - padding);
    xAxis.setAttribute("stroke", "black");

    svg.appendChild(xAxis);


    // Y axis labels
    for (let i = 0; i <= maxQuestion; i++) {

        const y =
            height -
            padding -
            (i / maxQuestion) * graphHeight;

        const tick = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "line"
        );

        tick.setAttribute("x1", padding - 5);
        tick.setAttribute("y1", y);
        tick.setAttribute("x2", padding);
        tick.setAttribute("y2", y);
        tick.setAttribute("stroke", "black");

        svg.appendChild(tick);


        const text = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "text"
        );

        text.setAttribute("x", padding - 10);
        text.setAttribute("y", y + 5);
        text.setAttribute("text-anchor", "end");
        text.setAttribute("font-size", "12");

        text.textContent = i;

        svg.appendChild(text);
    }


    // Bars
    values.forEach((value, index) => {

        const x =
            padding +
            index * barSpacing +
            (barSpacing - barWidth) / 2;

        const barHeight =
            (value / maxQuestion) * graphHeight;

        const y =
            height -
            padding -
            barHeight;


        const bar = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "rect"
        );

        bar.setAttribute("x", x);
        bar.setAttribute("y", y);
        bar.setAttribute("width", barWidth);
        bar.setAttribute("height", barHeight);
        bar.setAttribute("fill", "skyblue");

        svg.appendChild(bar);

        // Exam level above bar
        const valueText = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "text"
        );

        valueText.setAttribute("x", x + barWidth / 2);
        valueText.setAttribute("y", y - 5);
        valueText.setAttribute("text-anchor", "middle");
        valueText.setAttribute("font-size", "12");

        valueText.textContent = value;

        svg.appendChild(valueText);
    });


    // X axis label
    const dateLabel = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "text"
    );

    dateLabel.setAttribute("x", width / 2);
    dateLabel.setAttribute("y", height - 15);
    dateLabel.setAttribute("text-anchor", "middle");
    dateLabel.setAttribute("font-size", "16");

    dateLabel.textContent = "Time";

    svg.appendChild(dateLabel);


    // Y axis label
    const questionLabel = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "text"
    );

    questionLabel.setAttribute("x", 20);
    questionLabel.setAttribute("y", height / 2);
    questionLabel.setAttribute("text-anchor", "middle");
    questionLabel.setAttribute("font-size", "16");

    questionLabel.textContent = "Level";

    svg.appendChild(questionLabel);


    document
        .getElementById("checkpointChart")
        .appendChild(svg);
}


export function drawXPGraph(history) {

    const width = 800;
    const height = 400;
    const padding = 80;
    
    const svg = document.createElementNS("http://www.w3.org/2000/svg","svg");
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);

    const maxXP = Math.max(...history.map(point => point.xp));
    let points = "";
    const firstDate = history[0].date.getTime();
    const lastDate = history[history.length - 1].date.getTime();
    const timeRange = lastDate - firstDate || 1;
    let previousY = null;

    history.forEach((point, index)=>{

        const position = (point.date.getTime() - firstDate) / timeRange;
        const x = padding + position * (width - padding * 2);
        const y = height - padding - (point.xp / maxXP) * (height - padding * 2);

        if (index === 0) {
            points += `${x},${y} `;
        } else {
            // move horizontally at the old XP level
            points += `${x},${previousY} `;
            points += `${x},${y} `;
        }
        previousY = y;
    });

    const xAxis = document.createElementNS("http://www.w3.org/2000/svg","line");

    xAxis.setAttribute("x1", padding);
    xAxis.setAttribute("y1", height - padding);
    xAxis.setAttribute("x2",width - padding);
    xAxis.setAttribute("y2",height - padding);
    xAxis.setAttribute("stroke","black");

    svg.appendChild(xAxis);

    const yAxis = document.createElementNS("http://www.w3.org/2000/svg","line");

    yAxis.setAttribute("x1", padding);
    yAxis.setAttribute("y1", padding);
    yAxis.setAttribute("x2",padding);
    yAxis.setAttribute("y2", height - padding);
    yAxis.setAttribute("stroke","black");

    svg.appendChild(yAxis);

    const timeLabel = document.createElementNS("http://www.w3.org/2000/svg","text");

    timeLabel.setAttribute("x", width / 2);
    timeLabel.setAttribute("y", height - 20);
    timeLabel.setAttribute("text-anchor", "middle");
    timeLabel.setAttribute("font-size", "16");
    timeLabel.textContent = "Time";

    svg.appendChild(timeLabel);

    const xpLabel = document.createElementNS("http://www.w3.org/2000/svg","text");

    xpLabel.setAttribute("x", 20);
    xpLabel.setAttribute("y", height / 2);
    xpLabel.setAttribute("text-anchor", "middle");
    xpLabel.setAttribute("font-size", "16");

    xpLabel.textContent = "XP";

    svg.appendChild(xpLabel);

    for (let i = 0; i <= 5; i++) {
        const value = Math.round((maxXP / 5) * i);
        const y = height - padding - ((value / maxXP) * (height - padding * 2));

        // small tick mark
        const tick = document.createElementNS("http://www.w3.org/2000/svg","line");

        tick.setAttribute("x1", padding - 5);
        tick.setAttribute("y1", y);
        tick.setAttribute("x2", padding);
        tick.setAttribute("y2", y);
        tick.setAttribute("stroke", "black");

        svg.appendChild(tick);

        // number label
        const text = document.createElementNS("http://www.w3.org/2000/svg","text");

        text.setAttribute("x", padding - 10);
        text.setAttribute("y", y + 5);
        text.setAttribute("text-anchor", "end");
        text.setAttribute("font-size", "12");

        text.textContent = value;

        svg.appendChild(text);
    }


    

    const line = document.createElementNS("http://www.w3.org/2000/svg","polyline");

    line.setAttribute("points",points);
    line.setAttribute("fill","none");
    line.setAttribute("stroke","skyblue");
    line.setAttribute("stroke-width","3");

    svg.appendChild(line);

    document.getElementById("xpGraph").appendChild(svg);
}


export function drawSkillGraph(skills) {
    const size = 400;
    const centre = size / 2;
    const radius = 140;

    const names = Object.keys(skills);
    const values = Object.values(skills);

    const svg = document.createElementNS("http://www.w3.org/2000/svg","svg");

    svg.setAttribute("width", size);
    svg.setAttribute("height", size);
    svg.setAttribute("viewBox", `0 0 ${size} ${size}`);

    //draw the outside shape
    let outline = "";

    for (let i = 0; i < names.length; i++) {
        const angle = ((Math.PI * 2) / names.length) * i - Math.PI / 2;
        const x = centre + radius * Math.cos(angle);
        const y = centre + radius * Math.sin(angle);

        outline += `${x},${y} `;
    }

    const polygon = document.createElementNS("http://www.w3.org/2000/svg","polygon");

    polygon.setAttribute("points", outline);
    polygon.setAttribute("fill", "none");
    polygon.setAttribute("stroke", "grey");

    svg.appendChild(polygon);

    //draw lines and labels
    for (let i = 0; i < names.length; i++) {

        const angle = ((Math.PI * 2) / names.length) * i - Math.PI / 2;
        const x = centre + radius * Math.cos(angle);
        const y = centre + radius * Math.sin(angle);
        const line = document.createElementNS("http://www.w3.org/2000/svg","line");

        line.setAttribute("x1", centre);
        line.setAttribute("y1", centre);
        line.setAttribute("x2", x);
        line.setAttribute("y2", y);
        line.setAttribute("stroke", "lightgrey");

        svg.appendChild(line);

        const text = document.createElementNS("http://www.w3.org/2000/svg","text");

        text.setAttribute("x",centre + (radius + 30) * Math.cos(angle));
        text.setAttribute("y",centre + (radius + 30) * Math.sin(angle));
        text.setAttribute("text-anchor", "middle");
        text.setAttribute("font-size", "12");
        text.textContent = names[i];

        svg.appendChild(text);
    }


    //draw the user's skill polygon
    let points = "";

    for (let i = 0; i < values.length; i++) {

        const angle = ((Math.PI * 2) / values.length) * i - Math.PI / 2;
        const currentRadius = (radius * values[i]) / 100;
        const x = centre + currentRadius * Math.cos(angle);
        const y = centre + currentRadius * Math.sin(angle);
        points += `${x},${y} `;
    }

    const userPolygon = document.createElementNS("http://www.w3.org/2000/svg","polygon");
    userPolygon.setAttribute("points", points);
    userPolygon.setAttribute("fill", "skyblue");
    userPolygon.setAttribute("fill-opacity", "0.5");
    userPolygon.setAttribute("stroke", "blue");

    svg.appendChild(userPolygon);


    document.getElementById("skillGraph").appendChild(svg);
}
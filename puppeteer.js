import puppeteer from 'puppeteer';

const URL = 'https://www.spinsoul.com.br/calendario';

(async () => {
    const randomWaitTime = Math.floor(Math.random() * 5000) + 1000; // Espera entre 1 e 6 segundos
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(URL);


    await new Promise(r => setTimeout(r, randomWaitTime));

    // await page.screenshot({ path: 'screenshot.jpg' });

    const profData = await page.evaluate(() => {

        const allColumnsDatas = Array.from(document.querySelectorAll('.row.justify-content-center>div.col'))
        const arrayAllColumnsHtmlDates = allColumnsDatas.slice(0, 5)
        const arrayAllColumnsHtmlProfData = allColumnsDatas.slice(5)

        const arrayAllDates = arrayAllColumnsHtmlDates.map((htmlData) => htmlData.querySelector('.col-bloco-horario>p.data').innerText)

        const arrayAllProfData = arrayAllColumnsHtmlProfData.map((htmlData, index) => {
            const arrayHtmlData = Array.from(htmlData.querySelectorAll('.col-bloco-aula.d-flex.flex-wrap.align-items-center'))

            const arrayOnlyActiveDatas = arrayHtmlData.filter((data) => !data.classList.contains('encerrada'))

            const filterData = arrayOnlyActiveDatas.map((data) => ({
                instrutor: data.querySelector('.instutor').innerText,
                horario: data.querySelector('.horario').innerText.substring(0, 5),
            }))

            return {
                data: arrayAllDates[index],
                aulas: filterData,
            }
        })

        return arrayAllProfData
    })

    await new Promise(r => setTimeout(r, randomWaitTime));
    
    console.log(profData);
  
    await browser.close();
})();
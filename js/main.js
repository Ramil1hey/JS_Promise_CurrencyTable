const list = new CurrencySort();
const sortA = document.querySelector('.sortA');
const tbody = document.querySelector('tbody');
const table = document.querySelector('table');

let url = 'https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json';
let options =
{
    method: 'GET'
}
let req = fetch(url, options);

req.then(response => response.json())
    .then(data => {
        list.init(data);
        list.rendermovies(data);
        list.drawToDom(tbody);
    })
    .catch(err => {
        table.innerHTML = 'Ошибка при загрузке данных';
        console.error(err);
    });


sortA.addEventListener('click', function (e) {
    e.preventDefault();
    const target = e.target;
    const dataAttr = target.getAttribute('data-sort');
    if (!dataAttr) {
        return;
    }
    list.sort(dataAttr);
})

function CurrencySort() {
    this.init = function (data) {
        this.data = data;
    }

    this.flag = true;

    this.sort = function (attr) {
        if (attr === 'more25uah') {
            this.sortmore25uah(this.data);
        }
        if (attr === 'alpha') {
            this.alpha(this.data);
        }
        if (attr === 'ticker') {
            this.ticker(this.data);
        }
    }

    this.sortmore25uah = function (data) {
        if (data === undefined) {
            return
        }
        let more25;
        if (this.flag) {
            this.flag = false;
            more25 = data.filter((num) => {
                return num.rate >= 25;
            })
        }
        else {
            this.flag = true;
            more25 = data.filter((num) => {
                return num.rate <= 25;
            })
        }

        this.rendermovies(more25);
        this.drawToDom(tbody);
    }

    this.alpha = function (data) {
        if (data === undefined) {
            return
        }
        if (this.flag) {
            this.flag = false;
            data.sort((s1, s2) => {
                return s1.txt.localeCompare(s2.txt);
            });
        } else {
            this.flag = true;
            data.sort((s2, s1) => {
                return s1.txt.localeCompare(s2.txt);
            });
        }

        this.rendermovies(data);
        this.drawToDom(tbody);
    }

    this.ticker = function (data) {
        if (data === undefined) {
            return
        }
        if (this.flag) {
            this.flag = false;
            data.sort((s1, s2) => {
                return s1.cc.localeCompare(s2.cc);
            });
        } else {
            this.flag = true;
            data.sort((s2, s1) => {
                return s1.cc.localeCompare(s2.cc);
            });
        }

        this.rendermovies(data);
        this.drawToDom(tbody);
    }

    this.rendermovies = function (data) {
        this.fragment = document.createDocumentFragment();
        data.forEach(element => {
            const html = `
                    <td>${element.txt}</td>
                    <td>${element.rate}</td>
                    <td>${element.cc}</td>
                    <td>${element.exchangedate}</td>
                `;
            const tr = document.createElement('tr');
            tr.classList.add('row');
            tr.innerHTML = html;
            this.fragment.appendChild(tr);
        });
    }

    this.drawToDom = function (selector) {
        this.selector = selector;
        selector.innerHTML = "";
        selector.appendChild(this.fragment)
    }
}
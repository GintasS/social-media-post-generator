
<div align="center">
  <h1>Social Media Post Generator</h1>
</div>

<div align="center">
<br />

[![license](https://img.shields.io/github/license/dec0dOS/amazing-github-template.svg?style=flat-square)](LICENSE)


</div>

<details open="open">
<summary>Table of Contents</summary>

- [About](#about)
  - [Built With](#built-with)
- [Getting Started](#getting-started)
  - [Usage BE](#usage-be)
  - [Usage FE](#usage-fe) 
- [License](#license)

</details>

---

## About

This is a cool app where you can generate posts for LinkedIn, Twitter (X) and other platforms.

### Built With

- Python 3.13
- React
- Next.JS 15
- OpenAI Responses API

## Getting Started

### Usage-BE

1. Create a venv.

2. cd to `backend-py\src`.

3. Install from requirements.txt

    ```bash
    pip install -r requirements.txt
    ```

4. Create `.env` file inside `backend-py/src` directory.

    ```bash
    touch .env
    ```

5. Add two keys to `.env` file:

    ```bash
    OPENAI_API_KEY=
    PORT=3001
    ```
  
    WHERE OPENAI_API_KEY is your API KEY.


6. Run main as a module.

    ```bash
    python -m src.main
    ```

7. Go to Swagger Docs to play with the API.

    ```localhost:3001/docs```


### Usage-FE

```bash
cd frontend
npm install
npm run dev
```

## License

This project is licensed under the **MIT license**. Feel free to edit and distribute this template as you like.

See [LICENSE](LICENSE) for more information.
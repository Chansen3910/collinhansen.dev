<script>
    import { onMount } from 'svelte';

    let wordContainer;
    let wordList = [];
    let miss = 0, time = 3000;

    onMount(function() {
        wordList = document.getElementById(`word-list`).children;

        scrollToRandomWord();
    });

    function scrollToRandomWord() {
        let randomChild = (miss >= 3)? (wordList[0]): (wordList[Math.floor(Math.random() * wordList.length)]);
        
        if(randomChild != wordList[0]) {
            miss++;
            time = Math.random() * 3000 + 1000;
        }else {
            miss = 0;
            time = 3000;
        }

        if(wordContainer) wordContainer.scrollTo({ top: randomChild.offsetTop, behavior: 'smooth' });
        setTimeout(scrollToRandomWord, time);
    }
</script>

<header class="col center">
    <h1>Collin Hansen</h1>
    <div id="word-list-container" bind:this={ wordContainer }>
        <ul id="word-list">
            <li>Web Developer</li>
            <li>Computer scientist</li>
            <li>Devops engineer</li>
            <li>TV and music pirater</li>
            <li>Cloud solutions technician</li>
            <li>Remorseless mosquito squasher</li>
            <li>Web designer</li>
            <li>French cuisine lover</li>
            <li>Digital artist</li>
            <li>Real estate developer</li>
            <li>Photographer</li>
            <li>Image optimization specialist</li>
            <li>3D asset designer</li>
            <li>Code optimization enthusiast</li>
            <li>Home builder</li>
            <li>3D model rigger / animator</li>
            <li>Video editor</li>
            <li>Expert video transcoder / chunker</li>
            <li>HLS content packager</li>
            <li>DIY enthusiast</li>
            <li>Custom build tool developer</li>
            <li>Outdoorsman</li>
            <li>Full-stack software architect</li>
            <li>Porsche driver</li>
            <li>Hobbyist game developer</li>
            <li>Porsche enthusiast</li>
            <li>Socket programmer</li>
            <li>Home cook</li>
            <li>Database administrator</li>
            <li>Hobbyist auto mechanic</li>
            <li>Data migration technician</li>
            <li>Problem solver</li>
            <li>Multithreaded C++ developer</li>
            <li>Team player</li>
            <li>Containerized process orchestrator</li>
            <li>Cybersecurity analyst</li>
            <li>Solutions analyst</li>
            <li>World traveler</li>
            <li>Database designer</li>
            <li>REST API scraper</li>
            <li>Vintage audio equipment reseller</li>
            <li>Theater snob</li>
        </ul>
    </div>        
</header>

<style>
    li {
        margin-bottom: 0.5em;
    }

    header {
        color: rgb(255, 255, 255);
        padding: 1em 0;

        background: rgb(20, 20, 70);
        background: linear-gradient(
            70deg,
            rgb(175, 70, 0) 0%,
            rgb(255, 0, 120) 20%,
            rgb(0, 120, 255) 40%,
            rgb(120, 0, 120) 60%,
            rgb(175, 70, 0) 80%
        );
        background-size: 500% 100%;
        animation: gradient 33s linear infinite;
    }

    @keyframes gradient {
        0% {
            background-position-x: 0%;
        }
        100% {
            background-position-x: 500%;
        }
    }

    #word-list-container {
        max-height: 2em;
        width: 300px;
        text-align: center;
        overflow: hidden;
        position: relative;
    }

    #word-list {
        list-style: none;
        padding: 0;
        margin: 0;
    }
</style>

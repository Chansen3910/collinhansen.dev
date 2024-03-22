<script>
    import '@fortawesome/fontawesome-free/css/all.min.css';

    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: `smooth`
        });
    }
</script>

<footer>
    <div class="col">
        <span style="cursor:pointer;font-size:x-large;" class="fas fa-caret-up" role="none" on:click={ scrollToTop }></span>
        <span style="cursor:pointer;font-size:x-small;" role="none" on:click={ scrollToTop }>TOP</span>
    </div>
    <h3>Thank you for your time.</h3>
    <div class="row">
        <a class="col center" href="mailto:chansen3910@gmail.com?subject=Job opportunity at &body=Hello Collin, Are you still looking for a job? My name is ">
            <span class="fas fa-envelope"></span>
        </a>
        <a class="col center" href="tel:4322716960">
            <span class="fas fa-phone"></span>
        </a>
        <a class="col center" href="./Collin_Hansen-Web_Developer.pdf" download>
            <span class="fas fa-download"></span>
        </a>
    </div>
</footer>

<style>
    footer {
        background-color: rgb(12, 12, 70);
        color: rgb(255, 255, 255);
        text-align: center;
        padding: 20px;
        margin: 0px;
    }
    footer a {
        height: 33px;
        width: 33px;

        cursor: pointer;

        border-radius: 100%;
        font-size: small;

        background-color: rgb(20, 20, 20);
        color: rgb(255, 255, 255);
        text-decoration: none;

        border-bottom: 1px solid rgb(50, 50, 70);
    }
    footer a:hover {
        border-bottom: 3px solid rgb(50, 50, 70);
    }
    footer a:active {
        border-bottom: 0px;
    }
    footer div.row {
        justify-content: center !important;
        width: 100%;
    }
    footer div.row a:not(:first-child) {
        margin-left: 12px;
    }
</style>

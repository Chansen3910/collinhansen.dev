<script>
    import ManyColors from '$lib/components/ManyColors.svelte';
    import Foot from '$lib/components/Foot.svelte';
    import SplashDragger from '$lib/components/SplashDragger.svelte';

    import '$lib/global.css';

    let SplashDraggerRef;

    function toggle(e) {
        console.log(e);
        let element = e.srcElement;
        let paragraphElements = element.parentElement.querySelectorAll(`p`);

        if(element.innerHTML == "See less") {
            for(let i = 1; i < paragraphElements.length; i++) paragraphElements[i].style.display = `none`;
            element.innerHTML = "See more";
            //If the user clicks "See less" while scrolled past the parent element's offsetTop position, scroll back up with an extra 12 px of space.
            //This is so that the content retracts and the user is prepared to read the next sections from where they left off when they expanded the content.
            if(window.scrollY > element.parentElement.offsetTop) window.scrollTo({ top: element.parentElement.offsetTop - 12, behavior: "smooth" });
            return;
        }

        for(let i = 1; i < paragraphElements.length; i++) paragraphElements[i].style.display = `block`;
        element.innerHTML = "See less";
        //TODO: Are these fighting each other?
        //If the users clicks "See more" and is not scrolled down far enough, scroll down to bring all of the content into view.
        //if(window.scrollY < element.offsetTop - (window.innerHeight - element.offsetLeft)) window.scrollTo({ top: element.offsetTop - (window.innerHeight - element.offsetLeft), behavior: "smooth" });
        //If the user clicks "See more" while scrolled past the parent element's offsetTop position, scroll back up with an extra 12 px of space.
        //This action is so that the user can read the expanded content from the top without having to scroll up.
        if(window.scrollY < element.parentElement.offsetTop) window.scrollTo({ top: element.parentElement.offsetTop - 12, behavior: "smooth" });
    }

    function onLoad() {
        //Fade and remove loading-screen element using an exponential linear function.
        let x = 100, seconds = 0.5;
        const CURVE = 0.05, EULER = 2.71828182846;
        let fadeInterval = setInterval(function() {
            //This was translated from desmos after visually modeling a smooth CURVE value.
            //The linear function itself was found using the exponential point intercept formula to find the function that passes through (100, 100).
            let y = ((100 / Math.pow(EULER, 100 * CURVE)) * Math.pow(EULER, CURVE * x--));
            loadingScreenRef.style.opacity = `${ y / 100 }`;
            if(x <= 0) {
                clearInterval(fadeInterval);
                loadingScreenRef.remove();
            }
        }, (seconds * 1000) / 100);

        //Show the content without FOUC.
        document.getElementById(`content`).style.display = `block`;
    }
</script>

<SplashDragger bind:this={ SplashDraggerRef } self={ SplashDraggerRef } />

<ManyColors />

<div class="container">
    <section id="contact">
        <h2>Contact</h2>
        <ul>
            <li>Email: <a href="mailto:chansen3910@gmail.com?subject=Job opportunity at &body=Hello Collin, Are you still looking for a job? My name is ">chansen3910@gmail.com</a></li>
            <li>Phone: <a href="tel:4322716960">(432) 271-6960</a></li>
            <li style="font-size:small;text-align:center;">
                <a href="./Collin_Hansen-Web_Developer.pdf" download>
                    <svg height="14px" width="14px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
                        viewBox="0 0 303.188 303.188" xml:space="preserve">
                        <g>
                            <polygon style="fill:#E8E8E8;" points="219.821,0 32.842,0 32.842,303.188 270.346,303.188 270.346,50.525 	"/>
                            <path style="fill:#FB3449;" d="M230.013,149.935c-3.643-6.493-16.231-8.533-22.006-9.451c-4.552-0.724-9.199-0.94-13.803-0.936
                                c-3.615-0.024-7.177,0.154-10.693,0.354c-1.296,0.087-2.579,0.199-3.861,0.31c-1.314-1.36-2.584-2.765-3.813-4.202
                                c-7.82-9.257-14.134-19.755-19.279-30.664c1.366-5.271,2.459-10.772,3.119-16.485c1.205-10.427,1.619-22.31-2.288-32.251
                                c-1.349-3.431-4.946-7.608-9.096-5.528c-4.771,2.392-6.113,9.169-6.502,13.973c-0.313,3.883-0.094,7.776,0.558,11.594
                                c0.664,3.844,1.733,7.494,2.897,11.139c1.086,3.342,2.283,6.658,3.588,9.943c-0.828,2.586-1.707,5.127-2.63,7.603
                                c-2.152,5.643-4.479,11.004-6.717,16.161c-1.18,2.557-2.335,5.06-3.465,7.507c-3.576,7.855-7.458,15.566-11.815,23.02
                                c-10.163,3.585-19.283,7.741-26.857,12.625c-4.063,2.625-7.652,5.476-10.641,8.603c-2.822,2.952-5.69,6.783-5.941,11.024
                                c-0.141,2.394,0.807,4.717,2.768,6.137c2.697,2.015,6.271,1.881,9.4,1.225c10.25-2.15,18.121-10.961,24.824-18.387
                                c4.617-5.115,9.872-11.61,15.369-19.465c0.012-0.018,0.024-0.036,0.037-0.054c9.428-2.923,19.689-5.391,30.579-7.205
                                c4.975-0.825,10.082-1.5,15.291-1.974c3.663,3.431,7.621,6.555,11.939,9.164c3.363,2.069,6.94,3.816,10.684,5.119
                                c3.786,1.237,7.595,2.247,11.528,2.886c1.986,0.284,4.017,0.413,6.092,0.335c4.631-0.175,11.278-1.951,11.714-7.57
                                C231.127,152.765,230.756,151.257,230.013,149.935z M119.144,160.245c-2.169,3.36-4.261,6.382-6.232,9.041
                                c-4.827,6.568-10.34,14.369-18.322,17.286c-1.516,0.554-3.512,1.126-5.616,1.002c-1.874-0.11-3.722-0.937-3.637-3.065
                                c0.042-1.114,0.587-2.535,1.423-3.931c0.915-1.531,2.048-2.935,3.275-4.226c2.629-2.762,5.953-5.439,9.777-7.918
                                c5.865-3.805,12.867-7.23,20.672-10.286C120.035,158.858,119.587,159.564,119.144,160.245z M146.366,75.985
                                c-0.602-3.514-0.693-7.077-0.323-10.503c0.184-1.713,0.533-3.385,1.038-4.952c0.428-1.33,1.352-4.576,2.826-4.993
                                c2.43-0.688,3.177,4.529,3.452,6.005c1.566,8.396,0.186,17.733-1.693,25.969c-0.299,1.31-0.632,2.599-0.973,3.883
                                c-0.582-1.601-1.137-3.207-1.648-4.821C147.945,83.048,146.939,79.482,146.366,75.985z M163.049,142.265
                                c-9.13,1.48-17.815,3.419-25.979,5.708c0.983-0.275,5.475-8.788,6.477-10.555c4.721-8.315,8.583-17.042,11.358-26.197
                                c4.9,9.691,10.847,18.962,18.153,27.214c0.673,0.749,1.357,1.489,2.053,2.22C171.017,141.096,166.988,141.633,163.049,142.265z
                                M224.793,153.959c-0.334,1.805-4.189,2.837-5.988,3.121c-5.316,0.836-10.94,0.167-16.028-1.542
                                c-3.491-1.172-6.858-2.768-10.057-4.688c-3.18-1.921-6.155-4.181-8.936-6.673c3.429-0.206,6.9-0.341,10.388-0.275
                                c3.488,0.035,7.003,0.211,10.475,0.664c6.511,0.726,13.807,2.961,18.932,7.186C224.588,152.585,224.91,153.321,224.793,153.959z"/>
                            <polygon style="fill:#FB3449;" points="227.64,25.263 32.842,25.263 32.842,0 219.821,0 	"/>
                            <g>
                                <path style="fill:#A4A9AD;" d="M126.841,241.152c0,5.361-1.58,9.501-4.742,12.421c-3.162,2.921-7.652,4.381-13.472,4.381h-3.643
                                    v15.917H92.022v-47.979h16.606c6.06,0,10.611,1.324,13.652,3.971C125.321,232.51,126.841,236.273,126.841,241.152z
                                    M104.985,247.387h2.363c1.947,0,3.495-0.546,4.644-1.641c1.149-1.094,1.723-2.604,1.723-4.529c0-3.238-1.794-4.857-5.382-4.857
                                    h-3.348C104.985,236.36,104.985,247.387,104.985,247.387z"/>
                                <path style="fill:#A4A9AD;" d="M175.215,248.864c0,8.007-2.205,14.177-6.613,18.509s-10.606,6.498-18.591,6.498h-15.523v-47.979
                                    h16.606c7.701,0,13.646,1.969,17.836,5.907C173.119,235.737,175.215,241.426,175.215,248.864z M161.76,249.324
                                    c0-4.398-0.87-7.657-2.609-9.78c-1.739-2.122-4.381-3.183-7.926-3.183h-3.773v26.877h2.888c3.939,0,6.826-1.143,8.664-3.43
                                    C160.841,257.523,161.76,254.028,161.76,249.324z"/>
                                <path style="fill:#A4A9AD;" d="M196.579,273.871h-12.766v-47.979h28.355v10.403h-15.589v9.156h14.374v10.403h-14.374
                                    L196.579,273.871L196.579,273.871z"/>
                            </g>
                            <polygon style="fill:#D1D3D3;" points="219.821,50.525 270.346,50.525 219.821,0 	"/>
                        </g>
                    </svg>
                    <span>download this page as PDF</span>
                </a>
            </li>
        </ul>
    </section>
    <section id="profile">
        <h2>Profile</h2>
        <p>Passionate software developer with experience in front-end and back-end technologies and architecture.</p>
        <p>Dedicated to creating efficient, extremely smooth, user-friendly, and visually appealing websites which exceed expectations.</p>
    </section>
    <section id="skills">
        <h2>Skills</h2>
        <ul style="list-style-type:disc;margin-left:1ch;">
            <li>Amazon Web Services, Google Cloud Platform.</li>
            <li>Podman, Docker containerization.</li>
            <li>React, Angular, Vue, Svelte.</li>
            <li>Web Components API, History API, WebGL, various browser APIs.</li>
            <li>HTML5, CSS3, JavaScript, WebAssembly.</li>
            <li>MariaDB / MySQL (SQL), MongoDB (NOSQL), OracleDB (SQL + PLSQL).</li>
            <li>TomCat, Payara, Spring, Express, Actix, Quiche, Drogon.</li>
            <li>C / C++, C#, Rust, Java, Node.js, Python.</li>
            <li>Make, Maven, Gradle, Jenkins.</li>
            <li>Debian Linux, Ubuntu Linux, Windows.</li>
            <li>Knowledge of Agile methodology, and the Software Development Life Cycle (SDLC).</li>
            <li>UX design with consideration to Swiss design simplicity / hierarchies of color and detail.</li>
            <li>Responsive, cross-browser front-end implementation.</li>
            <li>Image creation, alteration, and optimization using Krita and GIMP.</li>
            <li>Video transcoding / chunking using FFMPEG for HTTP Live Streaming (HLS), supporting Adaptive Bitrate.</li>
            <li>Competent and intentional use of data structures and algorithms.</li>
            <li>Experience with encryption algorithms, JWT, TLS, HTTP/2 (SPDY), HTTP/3 (QUIC), and information security best practices across the full stack.</li>
            <li>3D modeling and animation in Blender, specifically targeting GLB for graphics on the web.</li>
            <li>Knowledge of legal requirements and the importance of user privacy and the handling of sensitive data.</li>
            <li>Knowledge and experience using Git, Subversion, Version Control.</li>
        </ul>
    </section>
    <section id="projects">
        <h2>Projects</h2>
        <div class="project">
            <h3>Eclectic Hummingbird</h3>
            <p>A containerized prethreaded Linux socket application server written in C++ which currently supports HTTP/1.1. Designed to cache and serve static resources from a directory efficiently and asynchronously.</p>
            <p>On startup, the server socket is configured to listen for edge-triggered events (client connections) in non-blocking (asynchronous) mode.</p>
            <p>The cache is then constructed by traversing all subdirectories of a provided relative path (an std::string parameter) to locate and parse resources into readily-available objects (an unordered map of URI / path keys mapped to instances of the custom Resource class).</p>
            <p>After the initial construction and configuration stages, the main thread waits for new connections, accepts them to obtain the client socket, sets the socket to asynchronous non-blocking mode, and epoll_waits for the edge-triggered I/O ready state change.</p>
            <p>Once the socket is ready for IO processing, it is pushed to the back of a mutex-protected deque, managed by a separate threadpool dedicated to handling the client socket IO processing.</p>
            <p>A single available thread is notified when the mutex condition variable flag "queueNotEmpty" is set to true, and the socket is popped from the front for dedicated read / write.</p>
            <p>Several classes aid in the tasks of socket configuration, epoll context management, parsing of HTTP requests, creating and sending HTTP responses, and preparing static resources conveniently.</p>
            <p>I have several plans to improve the performance and reliability of the server before eventually adding automated encryption key management, connection / performance analytics, cybersecurity attack mitigation, JSON Web Tokens (JWT), and support for more protocols (HTTP/2 w/ TLS, perhaps HTTP/3??!!), per the associated W3C RFC definitions.</p>
            <span role="none" on:click={ toggle }>See more</span>
        </div>
        <div class="project">
            <h3>NewTube</h3>
            <p>A containerized video-on-demand web application built in Java on the Payara server platform.</p>
            <p>It began as a way for me to share recorded lectures with my classmates in a particularly difficult Networking class with a particularly difficult professor who could not speak English very well.</p>
            <p>The school would not allow us to take or share videos of lectures, but this professor was seriously difficult.. So instead of allowing us all to fail, I took matters into my own hands and screen-recorded from zoom in 1080p.</p>
            <p>As you might imagine, it was readily and effortlessly logistically feasible to manually share +/- 1.5 hours of 1080p video content after each lecture with everyone in the class, so I researched streaming protocols and ended up on this insane time-and-money-sink rabbit hole of attempting to make my own clandestine version of YouTube...</p>
            <p>Due to the cost of hosting, my fear of being caught and thrown in the clinker by the university CS department, and the lack of security (only a TLS wrapper around the domain, no implementation of JWT or other encryption layers), I took the live version of the website down almost immediately after finals and destroyed the database.</p>
            <p>The database used efficient stored procedures in MariaDB to access and mutate video metadata and analytics, user data, and comments / replies.</p>
            <p>None of the data was ever cached so the users would always receive the most up to date information, which probably also contributed to this project's demise.</p>
            <p>The thing is that this was being created outside of class, and my neck was being stuck way out, and very few of my fellow students appreciated the amount of brain effort, time, and money I put into this to make it so easy and available for them.</p>
            <p>The video transcoding scripts are built upon FFMPEG to take in videos of either 1080p or 720p resolution of the .MP4 container format, transcode them into H264 encoding, down grade the resolutions to support adaptive bitrate (1080, 720, 480, and 240), and finally chunk each resolution into 3 second .TS containers.</p>
            <p>The .M3U8 and video thumbnails are also automatically generated by this makefile script, although sometimes they had to be changed manually.</p>
            <p>I initially committed to strenuously uploading the packaged / chunked HLS resources to S3 storage manually until I finally got smart, and started using service agents to do the uploading for me.</p>
            <span role="none" on:click={ toggle }>See more</span>
        </div>
        <div class="project">
            <h3>F3!.js</h3>
            <p>A web componentized scene manager front-end framework extended by a simple web component which stands on the shoulders of Three.js to make it easier to manage immersive 3D scenes on the browser in an efficient and asynchronous manner.</p>
            <p>Also includes a dev tool web service called Map Maker, which processes uploaded static map models in the GLB file format into JavaScript files containing an octet map instantiation, where values are objects with members that hash into categorized triangle collections ("walls", "floors", and "ceilings" - using the y-component normals).</p>
            <p>You'd be correct if you say this algorithm is ravenous for memory, but the resulting map massively improves the performance of subsequent collision detection algorithms.</p>
            <p>The produced octet map instatiation allows for O(1) lookup access to ONLY the triangles of the static mesh which are in the immediate vicinity of the calling subject in real time.</p>
            <p>The parameters provided when the map is created allow developers to control the granularity (number of indices within the 3D space boundaries, the accuracy / closeness of the parametric equations used to determine if a given triangle is actually in or just grazing another unique indice).</p>
            <p>Other features of this componentized framework are automatic memory cleanup, simplified asynchronous asset loading, scenic transitions in HTML / CSS / JS, simplified I/O event listening, configuration, and cleanup, as well as a simple ui component / context manager.</p>
            <p>This one is still being cleaned up and streamlined, but I wish to someday demonstrate the O(1) collision detection and eventually make a map loader / coordination module for dynamic maps (which mutate as a response to events or morph mesh targets on embedded animations).</p>
            <span role="none" on:click={ toggle }>See more</span>
        </div>
        <div class="project">
            <h3>Study Buddy</h3>
            <p>This application demonstrates the MERN stack (MongoDB, Express.js, React.js, Node.js).</p>
            <p>Study Buddy is a study application which incentivizes learning by taking quizzes with virtual assets, badges, and a condescending, materialistic owl mascot.</p>
            <p>The game also runs on server time. When a user creates their account, the region determines the server time.</p>
            <p>The owl modulates his sarcastic tone accordingly and the player may find certain in-game facilities only available during certain hours.</p>
            <span role="none" on:click={ toggle }>See more</span>
        </div>
        <div class="project">
            <h3>NutriRDS</h3>
            <p>This application demonstrates the MEAN stack (MongoDB, Express.js, Angular.js, Node.js).</p>
            <p>This is a web application where you can bring your own dietary requirements and build your diet plans with assisted coordination.</p>
            <span role="none" on:click={ toggle }>See more</span>
        </div>
        <div class="project">
            <h3>Spotlight Operator</h3>
            <p>A community-wide improvised role-playing game developed using Svelte.js, served by middleware written in Rustlang using quiche, actix, and MySQL.</p>
            <p>Users are fed prompts which they are instructed to reply to with a comment or video response.</p>
            <p>At the end of the cycle, the chains of replies are rated by another set of users. The winners are rewarded with credits and the game begins again. Player hiscores are tallied on the site.</p>
            <span role="none" on:click={ toggle }>See more</span>
        </div>
    </section>
</div>

<Foot />

<style>
    section {
        margin-bottom: 2em;
    }
    h2 {
        margin-top: 0;
    }
    ul {
        list-style: none;
        padding: 0;
    }
    li {
        margin-bottom: 0.5em;
    }
    .container {
        max-width: 800px;
        margin: 0 auto;
        padding: 2em;
    }
    .project {
        border: 1px solid rgb(70, 70, 70);
        padding: 1em;
        background-color: rgb(20, 20, 20);
    }
    .project p:not(:nth-of-type(1)) {
        display: none;
    }
    .project span {
        font-weight: bolder;
        cursor: pointer;
    }
    a {
        color: rgb(255, 200, 200);
        font-weight: bolder;
        text-decoration: none;
        transition: color 0.2s ease-in-out;
        cursor: pointer;
    }
    a:hover {
        color: rgb(0, 110, 255);
        text-decoration: underline;
    }
</style>

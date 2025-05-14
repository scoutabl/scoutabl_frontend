import React from 'react'
const NotFoundPage = () => {
    return (
        <section class="h-screen bg-white flex flex-col items-center justify-center">
            <div class="bg-purplePrimary py-8 px-4 mx-auto min-w-xl max-w-screen-xl lg:py-16 lg:px-6 rounded-2xl shadow-xl">
                <div class="mx-auto max-w-screen-sm text-center">
                    <h1 class="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-white">404</h1>
                    <p class="mb-4 text-3xl tracking-tight font-bold text-white md:text-4xl">Something's missing...</p>
                    <p class="mb-4 text-lg font-medium text-white">Sorry, we can't find that page.</p>
                    <a href="/" class="inline-flex text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center border border-2 hover:bg-white hover:text-black">Back to Homepage</a>
                </div>
            </div>
        </section>
    )
}

export default NotFoundPage
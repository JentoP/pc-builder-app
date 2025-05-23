export default function SignInWarning() {
    return (
        <div className="mt-12 text-center border bg-sidebar rounded-lg p-5 shadow-sm">
            <p className="">Please
                <span className="mt-4 text-blue-600 hover:underline"> <a href="/sign-in"> sign in </a></span>
                to access the builder.</p>
        </div>
    )
}
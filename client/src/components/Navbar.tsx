import lock from './../assets/lock.svg'

export default function Navbar() {
  return (
    <nav className="bg-gray-800 text-white px-6 py-4 flex justify-between items-center">
      <div className="text-lg font-semibold">
        <img src={lock} height={40}></img>
        Password Manager
      </div>
    </nav>
  );
}

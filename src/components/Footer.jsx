import useThemeStore from "../store/ThemeStore";


export default function Footer() {

  const { isDark } = useThemeStore()


  return (
    <footer className={`text-gray-400 p-4 mt-auto ${isDark ? "bg-black" : "bg-white border-t "}`}>
      <div className="container mx-auto text-center">
        <p>&copy; {new Date().getFullYear()} watchWise. All rights reserved.</p>
        <div className="flex justify-center space-x-4 mt-2">
          <a href="#" className="hover:text-white">Privacy Policy</a>
          <a href="#" className="hover:text-white">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}

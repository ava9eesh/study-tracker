import LoginGate from "@/components/LoginGate";

export default function Page() {
  return (
    <>
      <LoginGate />
      <footer className="text-center text-sm text-gray-400 mt-20">
        Built by Avaneesh Shinde <br />
        Contact: <a href="https://discord.com/users/i_love_zandu_bam" className="text-blue-400">i_love_zandu_bam</a>
      </footer>
    </>
  );
}

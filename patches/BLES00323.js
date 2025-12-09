//
// Click Execute! to apply the SSL bypass patch!
//

const skipIntros = confirm("Also apply 'Skip Intros' patch?");

if (skipIntros) {
    // -[byte, 0xdd9e58, 0x30]
    elf.bytes[0xdd9e58] = 0x30;
    console.log("Intro movies disabled!");
}

// -[be32, 0x00d247a8, 0x38000015]
elf.bytes.set([0x38, 0x00, 0x00, 0x15], 0x00d247a8);
console.log("SSL bypass enabled!");
//
// Click Execute! to apply the SSL bypass patch!
//

// -[be32, 0x00d247a8, 0x38000015]
elf.bytes.set([0x38, 0x00, 0x00, 0x15], 0x00d247a8);
console.log("SSL bypass enabled!");
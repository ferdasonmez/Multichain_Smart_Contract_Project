
    // Configure the local IPFS node
    console.log(`Configuring the IPFS instance...`)
    const { create } = await import('ipfs-http-client');
    const ipfs = create();
    const endpointConfig = await ipfs.getEndpointConfig();
    console.log(`IPFS configured to connect via: `);
    console.debug(endpointConfig);
    console.log(` `)
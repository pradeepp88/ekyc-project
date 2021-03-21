const { Contract } = require('fabric-contract-api');

class accidentClaim extends Contract {

 async initLedger(ctx) {
  console.log("Initialized");
 }
 
 async startClaim(ctx, policyNumber, accidentLocation) {
        console.info('startClaim');

        const claim = {
            docType: "claim",
            policy: policyNumber,
            location: accidentLocation
        };

        await ctx.stub.putState(policyNumber, Buffer.from(JSON.stringify(claim)));
        console.info('completed startClaim');
    }
 
 async retrieveClaim(ctx, policyNumber) {
    // Write the code for this function to get the first claim record for a policy number
    console.log(`Retreiving claim for Policy Number ${policyNumber}`);
    let claimAsBytes = await ctx.stub.getState(policyNumber);
    
    if (!claimAsBytes || claimAsBytes.length === 0) {
        return null;
    }

    const retrievedData = JSON.parse(claimAsBytes.toString());
    let firstClaim = retrievedData.claim[0];
    return JSON.stringify(firstClaim);

    }
 
 async retrieveAllClaims(ctx, policyNumber) {
    // Write the code to retrive all of the claims
    console.log(`Retreiving all claims`);
    let claimAsBytes = await ctx.stub.getState(policyNumber);

    if (!claimAsBytes || claimAsBytes.length === 0) {
        return null;
    }

    const retrievedData = JSON.parse(claimAsBytes.toString());
    let allClaims = retrievedData.claim;
    return JSON.stringify(allClaims);

 }
 
 async addPoliceRecord(ctx, policyNumber, policeRecord) {
  // Write the code to update the claim record by adding the policeRecord (string)
  console.info(`Adding Police Record ${policeRecord} to Policy Number: ${policyNumber}`);

  const claim = {
    docType: "Police Record",
    policy: policyNumber,
    polRec: policeRecord 
  };

  await ctx.stub.putState(policyNumber, Buffer.from(JSON.stringify(claim)));
 }

 async addAdjustorReport(ctx, policyNumber, adjustorReport) {
     console.log("Checking user credentials");
     const claimAsBytes = ctx.stub.getState(policyNumber);
     const callerId = this.getCallerId(ctx);

     const retrievedClaim = JSON.parse(claimAsBytes.toString());

     if (retrievedClaim.adjustor.ledgerUser != callerId) {
        console.log("User is not Adjustor"); 
        return null; 
     }

     const claim = {
         docType: "Adjustor Report"
         report: adjustorReport
     }

     await ctx.stub.putState(policyNumber, Buffer.from(JSON.stringify(claim)));
     console.log("Adjustor Report Added Successfully");

 }
 
}


module.exports = accidentClaim;
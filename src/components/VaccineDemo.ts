import { v4 as uuid } from "uuid";
import {
    CreateCredentialTemplateRequest,
    CreateEcosystemRequest,
    CreateProofRequest,
    FieldType,
    InsertItemRequest,
    IssueFromTemplateRequest,
    TemplateData,
    TemplateField,
    TrinsicService,
    VerifyProofRequest,
		ServiceOptions
} from "@trinsic/trinsic/browser";

const options = ServiceOptions.fromPartial({
			serverEndpoint: "dev-internal.trinsic.cloud",
			serverPort: 443,
			serverUseTls: true,
	});

export async function vaccineDemo() {
    // createService() {
    const trinsic = new TrinsicService(options);
    // }

		console.log("trinsic", trinsic);

    // createEcosystem() {
    const ecosystem = await trinsic
        .provider()
        .createEcosystem(CreateEcosystemRequest.fromPartial({}));
    const ecosystemId = ecosystem.ecosystem!.id;
    // }

		console.log("ecosystem", ecosystem);
		console.log("ecosystemId", ecosystem);

    // setupActors() {
    // Create 3 different profiles for each participant in the scenario
    const allison = await trinsic.account().loginAnonymous(ecosystemId);
    const clinic = await trinsic.account().loginAnonymous(ecosystemId);
    const airline = await trinsic.account().loginAnonymous(ecosystemId);
    // }

		console.log("allison", allison);
		console.log("clinic", clinic);
		console.log("airline", airline);

    trinsic.options.authToken = clinic;
    const info = await trinsic.account().getInfo();

    // Create template
    trinsic.options.authToken = clinic;
    const template = await doTemplate(trinsic);

    // issueCredential() {
    // Prepare the credential values JSON document
    const credentialValues = JSON.stringify({
        firstName: "Allison",
        lastName: "Allisonne",
        batchNumber: "123454321",
        countryOfVaccination: "US",
    });

		console.log("create Credential", credentialValues);



    // Sign a credential as the clinic and send it to Allison
    trinsic.options.authToken = clinic;
    const issueResponse = await trinsic.credential().issueFromTemplate(
        IssueFromTemplateRequest.fromPartial({
            templateId: template.id,
            valuesJson: credentialValues,
        })
    );
    // }

		console.log("issue Credential", issueResponse);


    // storeCredential() {
    // Alice stores the credential in her cloud wallet.
    trinsic.options.authToken = allison;
    const insertResponse = await trinsic.wallet().insertItem(
        InsertItemRequest.fromPartial({
            itemJson: issueResponse.documentJson,
        })
    );
    // }

		console.log("store Credential", insertResponse);

    // shareCredential() {
    // Allison shares the credential with the venue.
    trinsic.options.authToken = allison;
    const proofResponse = await trinsic.credential().createProof(
        CreateProofRequest.fromPartial({
            itemId: insertResponse.itemId,
        })
    );
    // }

		console.log("store Credential Proof", proofResponse);

    // verifyCredential() {
    // The airline verifies the credential
    trinsic.options.authToken = airline;
    const verifyResponse = await trinsic.credential().verifyProof(
        VerifyProofRequest.fromPartial({
            proofDocumentJson: proofResponse.proofDocumentJson,
        })
    );
    // }

		console.log("verify Credential Proof", verifyResponse);


    return verifyResponse;
}

async function doTemplate(
    trinsicService: TrinsicService
): Promise<TemplateData> {
    // createTemplate() {
    //Define all fields
    const firstNameField = TemplateField.fromPartial({
        description: "First name of vaccine recipient",
        type: FieldType.STRING,
    });

    const lastNameField = TemplateField.fromPartial({
        type: FieldType.STRING,
        description: "Last name of vaccine recipient",
    });

    const batchNumberField = TemplateField.fromPartial({
        type: FieldType.STRING,
        description: "Batch number of vaccine",
    });

    const countryOfVaccinationField = TemplateField.fromPartial({
        type: FieldType.STRING,
        description: "Country in which the subject was vaccinated",
    });

    //Create request
    let request = CreateCredentialTemplateRequest.fromPartial({
        name: `VaccinationCertificate-${uuid()}`,
        fields: {
            firstName: firstNameField,
            lastName: lastNameField,
            batchNumber: batchNumberField,
            countryOfVaccination: countryOfVaccinationField,
        },
    });

    //Create template
    const response = await trinsicService.template().create(request);
    const template = response.data;
    // }

    return template!;
}
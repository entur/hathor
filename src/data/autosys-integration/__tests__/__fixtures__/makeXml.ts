interface MakeXmlOptions {
  vehicleReg?: string;
  vehicleId?: string;
  vehicleTypeId?: string;
  deckPlanId?: string;
  vehicleModelId?: string;
  includeVehicleModel?: boolean;
}

/** ResourceFrame as direct child of dataObjects (no CompositeFrame wrapper). */
export function makeXmlFlat({
  vehicleReg = 'AB1234',
  vehicleId = 'NMR:Vehicle:1',
  vehicleTypeId = 'NMR:VehicleType:1',
  deckPlanId = 'NMR:DeckPlan:1',
  vehicleModelId = 'NMR:VehicleModel:1',
  includeVehicleModel = true,
}: MakeXmlOptions = {}): string {
  const vehicleModelBlock = includeVehicleModel
    ? `<vehicleModels><VehicleModel id="${vehicleModelId}"><Name>Model X</Name></VehicleModel></vehicleModels>`
    : '';
  return `<?xml version="1.0" encoding="UTF-8"?>
<PublicationDelivery>
  <dataObjects>
    <ResourceFrame id="NMR:ResourceFrame:1">
      <vehicleTypes>
        <VehicleType id="${vehicleTypeId}">
          <Name>Bus Type A</Name>
        </VehicleType>
      </vehicleTypes>
      <deckPlans>
        <DeckPlan id="${deckPlanId}">
          <Name>Standard Layout</Name>
        </DeckPlan>
      </deckPlans>
      ${vehicleModelBlock}
      <vehicles>
        <Vehicle id="${vehicleId}">
          <RegistrationNumber>${vehicleReg}</RegistrationNumber>
        </Vehicle>
      </vehicles>
    </ResourceFrame>
  </dataObjects>
</PublicationDelivery>`;
}

export function makeXml({
  vehicleReg = 'AB1234',
  vehicleId = 'NMR:Vehicle:1',
  vehicleTypeId = 'NMR:VehicleType:1',
  deckPlanId = 'NMR:DeckPlan:1',
  vehicleModelId = 'NMR:VehicleModel:1',
  includeVehicleModel = true,
}: MakeXmlOptions = {}): string {
  const vehicleModelBlock = includeVehicleModel
    ? `<vehicleModels><VehicleModel id="${vehicleModelId}"><Name>Model X</Name></VehicleModel></vehicleModels>`
    : '';
  const rcFrame = (entBlocks: string) => `<?xml version="1.0" encoding="UTF-8"?>
<PublicationDelivery>
  <dataObjects>
    <CompositeFrame>
      <frames>
        <ResourceFrame id="NMR:ResourceFrame:1">
          ${entBlocks}
        </ResourceFrame>
      </frames>
    </CompositeFrame>
  </dataObjects>
</PublicationDelivery>`;

  return rcFrame(`<vehicleTypes>
            <VehicleType id="${vehicleTypeId}">
              <Name>Bus Type A</Name>
              <Length>12</Length>
              <Width>2.5</Width>
              <Height>3.2</Height>
              <PassengerCapacity>
                <SeatingCapacity>45</SeatingCapacity>
                <StandingCapacity>30</StandingCapacity>
              </PassengerCapacity>
            </VehicleType>
          </vehicleTypes>
          <deckPlans>
            <DeckPlan id="${deckPlanId}">
              <Name>Standard Layout</Name>
            </DeckPlan>
          </deckPlans>
          ${vehicleModelBlock}
          <vehicles>
            <Vehicle id="${vehicleId}">
              <RegistrationNumber>${vehicleReg}</RegistrationNumber>
            </Vehicle>
          </vehicles>
        `);
}

export interface PhysicalUnit {
  id: string;
  name: string;
  type: "CRAS" | "INSS" | "Receita Federal" | "Defensoria Pública" | "Poupatempo";
  address: string;
  cep: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
  openingHours: string;
  phone: string;
}

export const mockUnits: PhysicalUnit[] = [
  {
    id: "cras-sp-centro",
    name: "CRAS Sé",
    type: "CRAS",
    address: "Rua Antônio de Godói, 122 - Centro Histórico",
    cep: "01034-000",
    city: "São Paulo",
    state: "SP",
    lat: -23.541460,
    lng: -46.638570,
    openingHours: "Seg a Sex, 08h às 17h",
    phone: "(11) 3228-3069"
  },
  {
    id: "inss-sp-luz",
    name: "Agência INSS - Luz",
    type: "INSS",
    address: "Avenida Cásper Líbero, 46 - Centro",
    cep: "01033-000",
    city: "São Paulo",
    state: "SP",
    lat: -23.540190,
    lng: -46.637200,
    openingHours: "Seg a Sex, 07h às 13h",
    phone: "135"
  },
  {
    id: "receita-sp-luz",
    name: "Receita Federal - CAC Luz",
    type: "Receita Federal",
    address: "Avenida Prestes Maia, 733 - Centro",
    cep: "01031-001",
    city: "São Paulo",
    state: "SP",
    lat: -23.535800,
    lng: -46.633810,
    openingHours: "Seg a Sex, 08h às 12h",
    phone: "(11) 3315-3000"
  },
  {
    id: "poupatempo-se",
    name: "Poupatempo Sé",
    type: "Poupatempo",
    address: "Praça do Carmo, s/n - Sé",
    cep: "01019-200",
    city: "São Paulo",
    state: "SP",
    lat: -23.551170,
    lng: -46.631850,
    openingHours: "Seg a Sex, 07h às 19h; Sáb, 07h às 13h",
    phone: "0800 772 3633"
  },
  {
    id: "defensoria-sp-centro",
    name: "Defensoria Pública - Unidade Central",
    type: "Defensoria Pública",
    address: "Rua Boa Vista, 200 - Centro",
    cep: "01014-000",
    city: "São Paulo",
    state: "SP",
    lat: -23.545750,
    lng: -46.632940,
    openingHours: "Seg a Sex, 08h às 17h (com agendamento)",
    phone: "0800 773 4340"
  },
  {
    id: "cras-rj-centro",
    name: "CRAS Centro RJ",
    type: "CRAS",
    address: "Rua Presidente Vargas, 100 - Centro",
    cep: "20071-000",
    city: "Rio de Janeiro",
    state: "RJ",
    lat: -22.903539,
    lng: -43.179373,
    openingHours: "Seg a Sex, 09h às 17h",
    phone: "(21) 2222-2222"
  },
  {
    id: "inss-df-plano",
    name: "INSS Plano Piloto",
    type: "INSS",
    address: "SBS Quadra 2 Bloco O - Asa Sul",
    cep: "70070-120",
    city: "Brasília",
    state: "DF",
    lat: -15.801648,
    lng: -47.886470,
    openingHours: "Seg a Sex, 07h às 14h",
    phone: "135"
  },
  {
    id: "cras-lagarto-1",
    name: "CRAS - Unidade I (Lagarto)",
    type: "CRAS",
    address: "Rua Gustavo Hora, 123 - Centro",
    cep: "49400-000",
    city: "Lagarto",
    state: "SE",
    lat: -10.9110,
    lng: -37.6650,
    openingHours: "08:00-17:00",
    phone: "(79) 3631-0000"
  },
  {
    id: "cras-lagarto-2",
    name: "CRAS - Unidade II (Povoado Brasília)",
    type: "CRAS",
    address: "Av. João Alves Filho, s/n - Povoado Brasília",
    cep: "49400-000",
    city: "Lagarto",
    state: "SE",
    lat: -10.9200,
    lng: -37.6750,
    openingHours: "08:00-17:00",
    phone: "(79) 3631-0001"
  },
  {
    id: "inss-lagarto",
    name: "Agência INSS - Lagarto",
    type: "INSS",
    address: "Rua Laudelino Freire, 345 - Centro",
    cep: "49400-000",
    city: "Lagarto",
    state: "SE",
    lat: -10.9150,
    lng: -37.6680,
    openingHours: "07:00-13:00",
    phone: "135"
  },
  {
    id: "ceac-lagarto",
    name: "CEAC Lagarto",
    type: "Poupatempo",
    address: "Praça do Rosário, Shopping - Centro",
    cep: "49400-000",
    city: "Lagarto",
    state: "SE",
    lat: -10.9130,
    lng: -37.6700,
    openingHours: "07:00-13:00",
    phone: "(79) 3222-2222"
  }
];

import { getToken } from "./auth.js";

export async function graphqlRequest(query, variables = {}) {

    const response = await fetch(
        "https://learn.01founders.co/api/graphql-engine/v1/graphql",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getToken()}`,
            },
            body: JSON.stringify({
                query,
                variables,
            }),
        }
    );

    return response.json();
}

export const query = `
{
  user {
    id
    login
    auditRatio

    xps {
      amount
      event {
        createdAt
      }
    }

    xpTransactions: transactions(
      where: {
        type: { _eq: "xp" }
        _or: [
          { object: { type: { _eq: "project" } } }
          { path: { _like: "%check-points%" } }
        ]
      }
      order_by: { createdAt: asc }
    ) {
      amount
      createdAt
      type
      path
      object {
        name
        type
      }
    }

    piscineExamTransactions: transactions(
      where: {
        type: { _eq: "xp" }
        _or: [
          { path: { _like: "%/piscine-go/exam-01/%" } }
          { path: { _like: "%/piscine-go/exam-02/%" } }
          { path: { _like: "%/piscine-go/final-exam/%" } }
        ]
      }
      order_by: { createdAt: asc }
    ) {
      amount
      createdAt
      type
      path
      object {
        name
        type
      }
    }

    skillTransactions: transactions {
      type
      amount
    }
  }
}
`;
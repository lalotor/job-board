import DataLoader from 'dataloader';
import knex from 'knex';

export const db = knex({
  client: 'better-sqlite3',
  connection: {
    filename: './data/db.sqlite3',
  },
  useNullAsDefault: true,
});

db.on('query', ({ sql, bindings }) => {
  console.log('sql', sql, bindings);
});

export function createCompanyLoader() {
  return new DataLoader(async (companyIds) => {
    console.log('companyIds', companyIds);
    const companies = await db.select().from('companies').whereIn('id', companyIds);
    return companyIds.map((companyId) => {
      return companies.find((company) => company.id === companyId)
    });
  });
}

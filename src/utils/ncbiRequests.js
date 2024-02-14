import axios from 'axios';

export async function querySpecies(userInput) {
  // Get ids from search
  const query = userInput.toLowerCase();
  // Max number of ids that will be received
  const retMax = 10000;
  let retStart = 0;
  const ids = [];
  while (retStart >= 0) {
    const url1 = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=taxonomy&term=*${query}*[WORD]+species[rank]&retmax=${retMax}&retmode=json&retstart=${retStart}`;
    const resp1 = await axios.get(url1);
    resp1.data.esearchresult.idlist.forEach((e) => ids.push(e));
    if (Number(resp1.data.esearchresult.count) > ids.length) {
      retStart += retMax;
    } else {
      retStart = -1;
    }
    if (retStart > 50000) {
      throw Error('Too many results, narrow your search');
    }
  }

  const maxRequestIds = 400;
  // Make requests with maxRequestIds ids
  const taxons = [];
  for (let i = 0; i < ids.length; i += maxRequestIds) {
    const requestedIds = ids.slice(i, i + maxRequestIds).join(',');
    const url2 = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=taxonomy&id=${requestedIds}&retmode=json`;
    const resp2Data = await axios.get(url2);
    resp2Data.data.result.uids.forEach((e) => taxons.push(resp2Data.data.result[e]));
    // NCBI is very sensitive to the number of requests, so we need to wait a bit
    if (i + maxRequestIds < ids.length) { await setTimeout(() => {}, 2000); }
  }

  return taxons.filter((taxon) => taxon.species !== ''
     && !taxon.species.includes(' ')
     && taxon.rank === 'species' && taxon.scientificname.includes(query));
}

export async function taxonSuggest(userInput) {
  const url = `https://api.ncbi.nlm.nih.gov/datasets/v2alpha/taxonomy/taxon_suggest/${userInput}`;
  const resp = await axios.get(url);
  return resp.data.sci_name_and_ids.filter((e) => e.rank === 'SPECIES');
}

export async function getReferenceAssemblyId(taxonId) {
  const url = `https://api.ncbi.nlm.nih.gov/datasets/v2alpha/genome/taxon/${taxonId}/dataset_report?filters.reference_only=true`;
  const resp = await axios.get(url);
  return resp.data.reports[0].accession;
}

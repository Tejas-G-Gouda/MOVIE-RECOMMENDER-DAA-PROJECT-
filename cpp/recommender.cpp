#include <iostream>
#include <vector>
#include <string>
#include <cmath>
#include <utility>

using namespace std;

struct Movie {
    string title;
    string genre;
    double rating;
};

// Greedy Attribute-Based Similarity
double similarityScore(Movie m, string prefGenre, double prefRating) {
    double score = 0;

    if (m.genre == prefGenre)
        score += 5;   // greedy best match

    score -= abs(m.rating - prefRating);
    return score;
}

// Merge Sort
void merge(vector<pair<double,string>> &a, int l, int m, int r) {
    vector<pair<double,string>> temp;
    int i = l, j = m + 1;

    while (i <= m && j <= r) {
        if (a[i].first > a[j].first)
            temp.push_back(a[i++]);
        else
            temp.push_back(a[j++]);
    }

    while (i <= m) temp.push_back(a[i++]);
    while (j <= r) temp.push_back(a[j++]);

    for (size_t k = 0; k < temp.size(); k++)
        a[l + k] = temp[k];
}


void mergeSort(vector<pair<double,string>> &a, int l, int r) {
    if(l>=r) return;
    int m = (l+r)/2;
    mergeSort(a,l,m);
    mergeSort(a,m+1,r);
    merge(a,l,m,r);
}

int main() {
    ios::sync_with_stdio(false);

    string prefGenre;
    double prefRating;
    cin >> prefGenre >> prefRating;

    vector<Movie> movies = {
        {"Inception","Sci-Fi",8.8},
        {"Interstellar","Sci-Fi",8.6},
        {"The Dark Knight","Action",9.0},
        {"Dangal","Sports",8.4},
        {"Gravity","Sci-Fi",7.7}
    };

    vector<pair<double,string>> scored;

    for(auto &m: movies) {
        double s = similarityScore(m,prefGenre,prefRating);
        scored.push_back({s,m.title});
    }

    mergeSort(scored,0,scored.size()-1);

    for(auto &p: scored)
        cout << p.second << " " << p.first << endl;

    return 0;
}
